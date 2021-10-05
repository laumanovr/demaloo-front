<template>
	<div class="company-team">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">Команда компании</div>

		<div class="add-member">
			<v-select
				outlined
				label="Фильтр"
				:items="memberTypes"
				item-text="title"
				item-value="type"
				v-model="selectedMemberType"
				@change="filterMembers"
			/>
			<button class="btn blue-primary" @click="toggleTeamModal('add')">Добавить сотрудника</button>
		</div>

		<table class="admin-table">
			<thead>
			<tr>
				<th>№</th>
				<th>Ф.И.О</th>
				<th>Номер телефона</th>
				<th>Должность</th>
				<th></th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(member, i) in teamMembers" :key="i">
				<td>{{ i + 1 }}</td>
				<td>{{ member.surname + ' ' + member.name }}</td>
				<td>0{{ member.phoneNumber }}</td>
				<td>{{ showOccupation(member.occupation) }}</td>
				<td class="actions">
					<EditIcon @click="toggleTeamModal('edit', member)"/>
					<DeleteIcon @click="deleteMember(member.id, true)"/>
				</td>
			</tr>
			</tbody>
		</table>

		<modal name="team-modal" height="auto">
			<div class="modal-container">
				<template v-if="mode == 'add' || mode == 'edit'">
					<h3>
						{{mode == 'add' ? 'Добавить ' : 'Редактировать '}}
						{{selectedMemberType == 'teamDrivers' ? 'водителя' : 'гида' }}
					</h3>
					<v-form ref="teamForm">
						<v-text-field
							outlined
							label="Имя"
							v-model="newMember.name"
							:rules="requiredRule"
						/>
						<v-text-field
							outlined
							label="Фамилия"
							v-model="newMember.surname"
							:rules="requiredRule"
						/>
						<div class="masked-input">
							<span class="label">Телефон</span>
							<MaskedInput
								mask="\0\ (111) 11-11-11"
								placeholder="0(555)12-34-56"
								v-model="showPhone"
								@input="newMember.phoneNumber = arguments[1]"
							/>
						</div>
					</v-form>
					<div class="btn-actions">
						<button class="btn red-primary" @click="toggleTeamModal">Отмена</button>
						<button class="btn green-primary" @click="submitMember">Сохранить</button>
					</div>
				</template>
				<template v-if="mode == 'delete'">
					<h3>Удалить этого сотрудника?</h3>
					<div class="btn-actions">
						<button class="btn blue-primary" @click="toggleTeamModal">Отмена</button>
						<button class="btn red-primary" @click="deleteMember">Удалить</button>
					</div>
				</template>
			</div>
		</modal>
	</div>
</template>

<script>
import MaskedInput from 'vue-masked-input';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';
import {mapState} from 'vuex';

export default {
	components: {
		MaskedInput,
		DeleteIcon,
		EditIcon
	},
	data() {
		return {
			requiredRule: [(v) => !!v || this.$t('requiredField')],
			occupations: [
				{title: 'Водитель', value: 'driver'},
				{title: 'Гид', value: 'guide'}
			],
			teamMembers: [],
			memberTypes: [
				{title: 'Водители', type: 'teamDrivers'},
				{title: 'Гиды', type: 'teamGuides'},
			],
			selectedMemberType: '',
			newMember: {
				name: '',
				surname: '',
				occupation: '',
				phoneNumber: ''
			},
			showPhone: '',
			isLoading: false,
			mode: '',
			removeIndex: ''
		};
	},
	computed: {
		...mapState('team', ['onSuccess', 'onError']),
		teamDrivers() {
			return this.$store.state.team.drivers;
		},
		teamGuides() {
			return this.$store.state.team.guides;
		},
		teamAllMembers() {
			return this.$store.state.team.allMembers;
		}
	},
	created() {
		this.selectedMemberType = 'teamDrivers';
		this.filterMembers(this.selectedMemberType);
	},
	methods: {
		filterMembers(type) {
			this.teamMembers = this[type];
			this.newMember.occupation = type === 'teamDrivers' ? 'driver' : 'guide';
		},

		toggleTeamModal(mode, member) {
			this.mode = mode;
			if (mode === 'add') {
				this.newMember.name = '';
				this.newMember.surname = '';
				this.newMember.phoneNumber = '';
				this.showPhone = '';
			} else if (mode === 'edit') {
				this.newMember.id = member.id;
				this.newMember.name = member.name;
				this.newMember.surname = member.surname;
				this.newMember.phoneNumber = member.phoneNumber;
				this.newMember.occupation = member.occupation;
				this.showPhone = member.phoneNumber;
			}
			this.$modal.toggle('team-modal');
		},

		showOccupation(position) {
			if (position) {
				return this.occupations.find((i) => i.value === position).title;
			}
		},

		async submitMember() {
			if (this.$refs.teamForm.validate()) {
				if (this.mode === 'add') {
					this.teamAllMembers.push(this.newMember);
				}
				if (this.mode === 'edit') {
					const index = this.teamAllMembers.findIndex((i) => i.id === this.newMember.id);
					this.teamAllMembers[index] = this.newMember;
				}
				this.handleSubmit();
			}
		},

		deleteMember(id, confirm) {
			if (confirm) {
				this.removeIndex = this.teamAllMembers.findIndex((i) => i.id === id);
				this.toggleTeamModal('delete');
			} else {
				this.teamAllMembers.splice(this.removeIndex, 1);
				this.handleSubmit();
			}
		},

		async handleSubmit() {
			this.isLoading = true;
			this.$store.dispatch('team/updateCompanyTeamMembers', {teamMembers: this.teamAllMembers});
		}
	},
	watch: {
		onSuccess(msg) {
			if (msg) {
				this.$toast.success('Успешно!');
				this.filterMembers(this.selectedMemberType);
				this.toggleTeamModal();
				this.newMember = {occupation: this.selectedMemberType === 'teamDrivers' ? 'driver' : 'guide'};
				this.isLoading = false;
				this.$store.state.team.onSuccess = '';
			}
		},
		onError(err) {
			if (err) {
				this.$toast.error(err);
				this.isLoading = false;
				this.$store.state.team.onError = '';
				if (this.mode === 'edit') {
					this.teamMembers.pop();
				}
			}
		}
	}
};
</script>

<style lang="scss">
.company-team {
	.add-member {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 30px 0;
		.v-select {
			max-width: 200px;
			.v-input__slot {
				background: #fff;
			}
		}
		.btn {
			max-width: 200px;
		}
	}
	.masked-input {
		margin: 10px 0 35px;
	}
	.actions {
		text-align: right;
	}
}
</style>