<template>
	<div class="company-team">
		<PreLoader v-if="isLoading"/>
		<div class="head-title">Команда компании</div>

		<div class="add-member">
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
			<tr v-for="(member, i) in companyTeam.teamMembers" :key="i">
				<td>{{ i + 1 }}</td>
				<td>{{ member.surname + ' ' + member.name }}</td>
				<td>0{{ member.phoneNumber }}</td>
				<td>{{ showOccupation(member.occupation) }}</td>
				<td class="actions">
					<EditIcon @click="toggleTeamModal('edit', member)"/>
					<DeleteIcon @click="deleteMember(i, true)"/>
				</td>
			</tr>
			</tbody>
		</table>

		<modal name="team-modal" height="auto">
			<div class="modal-container">
				<template v-if="mode == 'add' || mode == 'edit'">
					<h3>{{mode == 'add' ? 'Добавить члена команды' : 'Редактировать члена команды'}}</h3>
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
						<v-select
							outlined
							label="Должность"
							:items="occupations"
							item-text="title"
							item-value="value"
							v-model="newMember.occupation"
							:rules="requiredRule"
						/>
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
import {UserService} from '@/services/user.service';
import MaskedInput from 'vue-masked-input';
import PreLoader from '@/components/general/PreLoader';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';

export default {
	components: {
		MaskedInput,
		PreLoader,
		DeleteIcon,
		EditIcon
	},
	data() {
		return {
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			occupations: [
				{title: 'Водитель', value: 'driver'},
				{title: 'Гид', value: 'guide'}
			],
			companyTeam: {
				teamMembers: []
			},
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
	created() {
		this.isLoading = true;
		this.getCompanyTeamMembers();
	},
	methods: {
		async getCompanyTeamMembers() {
			try {
				const res = await UserService.fetchCompanyTeamMembers();
				this.companyTeam.teamMembers = res.data.teamMembers.map((member, i) => ({...member, index: i+1}));
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		toggleTeamModal(mode, member) {
			this.mode = mode;
			if (mode === 'add') {
				this.newMember.name = '';
				this.newMember.surname = '';
				this.newMember.phoneNumber = '';
				this.newMember.occupation = '';
				this.showPhone = '';
			} else if (mode === 'edit') {
				this.newMember.index = member.index;
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
					this.companyTeam.teamMembers.push(this.newMember);
				}
				if (this.mode === 'edit') {
					const index = this.companyTeam.teamMembers.findIndex((i) => i.index === this.newMember.index);
					this.companyTeam.teamMembers[index] = this.newMember;
				}
				this.handleSubmit();
			}
		},

		deleteMember(index, confirm) {
			if (confirm) {
				this.removeIndex = index;
				this.toggleTeamModal('delete');
			} else {
				this.companyTeam.teamMembers.splice(this.removeIndex, 1);
				this.handleSubmit();
			}
		},

		async handleSubmit() {
			try {
				this.isLoading = true;
				await UserService.updateCompanyTeamMembers(this.companyTeam);
				this.$toast.success('Успешно!');
				this.toggleTeamModal();
				this.newMember = {};
				this.isLoading = false;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
				if (this.mode === 'edit') {
					this.companyTeam.teamMembers.pop();
				}
			}
		}
	}
};
</script>

<style lang="scss">
.company-team {
	.add-member {
		text-align: right;
		margin: 30px 0;
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