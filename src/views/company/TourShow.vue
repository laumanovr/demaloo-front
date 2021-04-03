<template>
	<div class="tour-show-container">
		<PreLoader v-if="isLoading"/>
		<div class="info-block" v-if="selectedTourIsExist">
			<div class="title-block">
				<span class="head-title">{{ selectedTour.name.ru }}</span>
				<button class="btn white-color-blue">
					<router-link :to="{name: 'tourDetail', params: {tourId: selectedTour._id}}" target="_blank">
						Просмотреть
					</router-link>
				</button>
			</div>
			<div class="tour-info">
				<div class="info-fields left">
					<div>
						<label>Дата:</label>
						<span>{{ selectedTour.date }}</span>
					</div>
					<div>
						<label>Длительность:</label>
						<span>{{ selectedTour.duration }} дней</span>
					</div>
					<div>
						<label>Цена:</label>
						<span>{{ selectedTour.price }} сом</span>
					</div>
					<div>
						<label>Кол-во мест:</label>
						<span>{{selectedTour.bookingCount + " / " + selectedTour.peopleCount}}</span>
					</div>
					<div>
						<label>Локация:</label>
						<span>{{selectedTour.locations[0].place}}</span>
					</div>
					<div>
						<label>Транспорт:</label>
						<span>{{selectedTour.transport.ru}}</span>
					</div>
				</div>
				<v-form ref="editTourForm" class="info-fields right">
					<div>
						<label>Цена:</label>
						<v-text-field
							v-model.number="selectedTour.price"
							:rules="requiredRule"
							solo
						/>
					</div>
					<div>
						<label>Гид:</label>
						<v-select
							:items="teamGuides"
							item-text="fullName"
							return-object
							v-model="selectedTour.guides"
							:rules="requiredRule"
							solo
							multiple
						/>
					</div>
					<div>
						<label>Водитель:</label>
						<v-select
							:items="teamDrivers"
							item-text="fullName"
							return-object
							v-model="selectedTour.drivers"
							:rules="requiredRule"
							solo
							multiple
						/>
					</div>
					<div>
						<label>Место сбора</label>
						<v-text-field
							v-model="selectedTour.meetingPoint.ru"
							:rules="requiredRule"
							solo
						/>
					</div>
					<div class="meeting-time">
						<label>Время сбора</label>
						<vue-timepicker
							v-model="selectedTour.meetingTime"
							close-on-complete
						/>
					</div>
					<div>
						<label>Заметки</label>
						<v-text-field
							v-model="selectedTour.notes"
							solo
						/>
					</div>
					<div v-for="(item, i) in selectedTour.additional" :key="i">
						<label>Дополнительно:</label>
						<v-text-field v-model="item.ru" :rules="requiredRule" solo/>
					</div>
					<div class="save">
						<button
							type="button"
							class="btn green-primary"
							@click.prevent="updateTour"
						>
							Сохранить
						</button>
					</div>
				</v-form>
			</div>
		</div>

		<div class="actions-block">
			<button class="btn white" @click="toggleAddClientModal">+ Добавить человека</button>
			<div class="other">
				<ExcelExport :headers="excelHeaders" :rows="excelRows" :fileName="excelName" ref="excel">
					<template v-slot:excel>
						<button class="btn white-color-green" @click="exportClientBookings">Экспортировать</button>
					</template>
				</ExcelExport>
			</div>
		</div>

		<div class="clients-block">
			<table class="admin-table">
				<thead>
				<tr>
					<th>№</th>
					<th>ФИО</th>
					<th>Номер телефона</th>
					<th>Источник</th>
					<th>Дата брони</th>
					<th>Кол-во брони</th>
					<th>Общая сумма</th>
					<th>Статус</th>
					<th>-</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(client, i) in tourBookings" :key="i">
					<td>{{ i + 1 }}</td>
					<td>{{ client.customer.surname + ' ' + client.customer.name }}</td>
					<td>{{ client.customer.phoneNumber }}</td>
					<td>{{ showSource(client.source) }}</td>
					<td>{{ getReservedDate(getLastStage(client.stages).createdAt) }}</td>
					<td>{{ client.peopleCount }}</td>
					<td>{{ client.total }} сом</td>
					<td>{{ statuses[getLastStage(client.stages).status] }}</td>
					<td class="cancel">
						<template v-if="client.stages[0].status == 'ADDED'">
							<EditIcon @click="submitUpdateBooking(client, true)"/>
							<DeleteIcon @click="deleteBooking(client, true)"/>
						</template>
					</td>
				</tr>
				</tbody>
			</table>
		</div>

		<!--ADD MANUAL PERSON TO TOUR MODAL-->
		<modal name="add-person-modal" height="95%">
			<div class="modal-container">
				<h3>Добавить клиента в данный тур</h3>
				<v-form ref="addClientForm">
					<v-text-field
						outlined
						label="Имя"
						placeholder="Имя"
						v-model="newClient.name"
						:rules="requiredRule"
					/>
					<v-text-field
						outlined
						label="Фамилия"
						placeholder="Фамилия"
						v-model="newClient.surname"
						:rules="requiredRule"
					/>
					<div class="masked-input">
						<span class="label">Телефон</span>
						<MaskedInput
							mask="\+\996 (111) 11-11-11"
							placeholder="+996(555)12-34-56"
							@input="newClient.phoneNumber = arguments[1]"
						/>
						<v-text-field class="error-only" v-model="newClient.phoneNumber" :rules="phoneRule"/>
					</div>
					<v-select
						outlined
						label="Источник"
						placeholder="Источник"
						:items="sources"
						item-text="title"
						item-value="source"
						:rules="requiredRule"
						v-model="newClient.source"
					/>
					<v-text-field
						outlined
						label="Кол-во мест"
						placeholder="Кол-во мест"
						v-model.number="newClient.count"
						:rules="countQuantityRule"
						type="number"
					/>
					<v-text-field
						outlined
						label="Общая сумма"
						placeholder="Общая сумма"
						v-model.number="newClient.total"
						:rules="numberRule"
						type="number"
					/>
					<div class="btn-actions">
						<button class="btn red-primary" @click.prevent="toggleAddClientModal">Отмена</button>
						<button class="btn green-primary" @click.prevent="submitAddBooking">Сохранить</button>
					</div>
				</v-form>
			</div>
		</modal>

		<!--UPDATE MANUAL BOOKING-->
		<modal name="update-modal" height="auto">
			<div class="modal-container">
				<h3>Редактировать бронь</h3>
				<v-form ref="updateBookForm">
					<v-select
						outlined
						label="Источник"
						placeholder="Источник"
						:items="sources"
						item-text="title"
						item-value="source"
						:rules="requiredRule"
						v-model="selectedBooking.source"
					/>
					<v-text-field
						outlined
						label="Кол-во мест"
						placeholder="Кол-во мест"
						v-model.number="selectedBooking.peopleCount"
						:rules="countQuantityRule"
						type="number"
					/>
					<v-text-field
						outlined
						label="Общая сумма"
						placeholder="Общая сумма"
						v-model.number="selectedBooking.total"
						:rules="numberRule"
						type="number"
					/>
				</v-form>
				<div class="btn-actions">
					<button class="btn red-primary" @click.prevent="$modal.hide('update-modal')">Отмена</button>
					<button class="btn green-primary" @click.prevent="submitUpdateBooking">Сохранить</button>
				</div>
			</div>
		</modal>

		<!--DELETE ADDED MANUAL BOOKING MODAL-->
		<modal name="delete-modal" height="auto">
			<div class="modal-container">
				<h3>Удалить этот бронь?</h3>
				<div class="btn-actions">
					<button class="btn blue-primary" @click="$modal.hide('delete-modal')">Отмена</button>
					<button class="btn red-primary" @click="deleteBooking">Удалить</button>
				</div>
			</div>
		</modal>
	</div>
</template>

<script>
import {TourService} from '@/services/tour.service';
import PreLoader from '@/components/general/PreLoader';
import moment from 'moment';
import VueTimepicker from 'vue2-timepicker';
import MaskedInput from 'vue-masked-input';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';
import ExcelExport from '@/components/general/ExcelJs';

export default {
	components: {
		VueTimepicker,
		MaskedInput,
		PreLoader,
		EditIcon,
		DeleteIcon,
		ExcelExport
	},
	data() {
		return {
			isLoading: false,
			requiredRule: [(v) => !!v || 'Обязательное поле'],
			countQuantityRule: [
				v => !!v || 'Обязательное поле',
				v => (v && v > 0 && v <= this.restPlaceCount) || 'Неправильно указано кол-во мест'
			],
			numberRule: [
				(v) => !!v || 'Обязательное поле',
				(v) => (v && v > 0 && v <= 50000) || 'Неправильное значение'
			],
			phoneRule: [
				v => !!v || 'Обязательное поле',
				v => ( v && !v.includes('_') ) || 'Введите правильный номер телефона'
			],
			sources: [
				{title: 'Instagram', source: 'instagram'},
				{title: 'Facebook', source: 'facebook'},
				{title: 'На прямую', source: 'direct'}
			],
			statuses: {
				RESERVED: 'Бронь',
				PENDING: 'В ожидании',
				PAID: 'Оплачено',
				ADDED: 'Добавлен',
				CANCELLED: 'Отменен'
			},
			newClient: {
				name: '',
				surname: '',
				phoneNumber: '',
				count: '',
				total: '',
				source: ''
			},
			selectedTour: {},
			tourBookings: [],
			selectedBooking: {},
			restPlaceCount: 0,
			excelHeaders: [],
			excelRows: [],
			excelName: 'Список бронирований клиентов'
		};
	},
	computed: {
		selectedTourIsExist() {
			return Object.values(this.selectedTour).length > 0;
		},
		teamDrivers() {
			return this.$store.state.team.drivers.map((i) => ({...i, fullName: `${i.surname} ${i.name}`}));
		},
		teamGuides() {
			return this.$store.state.team.guides.map((i) => ({...i, fullName: `${i.surname} ${i.name}`}));
		},
	},
	created() {
		this.isLoading = true;
		this.showSelectedTour(this.$route.params.tourId);
	},
	methods: {
		async showSelectedTour(tourId) {
			try {
				const res = await TourService.fetchTourById(tourId);
				this.selectedTour = res.data.tour;
				this.selectedTour.date = moment(this.selectedTour.date, 'YYYY-MM-DD').format('DD.MM.YYYY');
				this.getTourBookings();
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		async getTourBookings() {
			try {
				const res = await TourService.fetchTourBookings(this.selectedTour._id);
				this.tourBookings = res.data.bookings;
				this.isLoading = false;
				this.restPlaceCount = this.selectedTour.peopleCount - this.selectedTour.bookingCount;
			} catch (err) {
				this.$toast.error(err);
				this.isLoading = false;
			}
		},

		getLastStage(stages) {
			return stages[stages.length - 1];
		},

		getReservedDate(date) {
			return moment(date).format("DD.MM.YYYY HH:mm");
		},

		showSource(source) {
			if (source) {
				return this.sources.find((i) => i.source === source).title;
			}
			return 'Demaloo';
		},

		async updateTour() {
			if (this.$refs.editTourForm.validate()) {
				try {
					this.isLoading = true;
					await TourService.updateTour(this.selectedTour);
					this.$toast.success('Успешно обновлено');
					this.isLoading = false;
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		toggleAddClientModal() {
			this.clearClientForm();
			this.$modal.toggle('add-person-modal');
		},

		clearClientForm() {
			for (let key in this.newClient) {
				this.newClient[key] = '';
			}
		},

		async submitAddBooking() {
			if (this.$refs.addClientForm.validate()) {
				this.newClient.phoneNumber = `+996${this.newClient.phoneNumber}`;
				this.isLoading = true;
				try {
					await TourService.addManualBooking(this.selectedTour._id, this.newClient);
					this.showSelectedTour(this.$route.params.tourId);
					this.toggleAddClientModal();
					this.$toast.success('Успешно добавлен!');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		async submitUpdateBooking(booking, confirm) {
			if (confirm) {
				this.selectedBooking = booking;
				this.$modal.show('update-modal');
			} else {
				if (this.$refs.updateBookForm.validate()) {
					try {
						this.isLoading = true;
						await TourService.updateManualBooking(this.selectedBooking);
						this.$modal.hide('update-modal');
						this.showSelectedTour(this.$route.params.tourId);
						this.$toast.success('Успешно обновлено!');
					} catch (err) {
						this.$toast.error(err);
						this.isLoading = false;
					}
				}
			}
		},

		async deleteBooking(booking, confirm) {
			if (confirm) {
				this.selectedBooking = booking;
				this.$modal.show('delete-modal');
			} else {
				try {
					this.isLoading = true;
					await TourService.deleteManualBooking(this.selectedBooking._id);
					this.$modal.hide('delete-modal');
					this.showSelectedTour(this.$route.params.tourId);
					this.$toast.success('Успешно удалено!');
				} catch (err) {
					this.$toast.error(err);
					this.isLoading = false;
				}
			}
		},

		exportClientBookings() {
			this.excelHeaders = ['ФИО', 'Телефон', 'Источник', 'Дата брони', 'Кол-во брони', 'Общая сумма', 'Статус'];
			this.excelRows = this.tourBookings.map((i) => {
				return [
					i.customer.surname +' '+ i.customer.name,
					i.customer.phoneNumber,
					this.showSource(i.source),
					this.getReservedDate(this.getLastStage(i.stages).createdAt),
					i.peopleCount,
					i.total,
					this.statuses[this.getLastStage(i.stages).status]
				];
			});
			this.$nextTick(() => {
				this.$refs.excel.exportExcel();
			});
		}
	},
};
</script>

<style lang="scss">
.tour-show-container {
	.info-block {
		background: #fff;
		padding: 24px;
		border: 1px solid $gray-light;
		border-radius: 4px;
		.title-block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-bottom: 16px;
			border-bottom: 1px solid $gray-light;
			.btn {
				max-width: 214px;
			}
		}
		.tour-info {
			display: flex;
			margin-top: 24px;
			.info-fields {
				label {
					word-break: break-all;
					font-size: 16px;
					color: $gray-dark;
					display: inline-block;
					width: calc(50% - 5px);
					margin-right: 5px;
				}
				&.left {
					width: 35%;
					border-right: 1px solid $gray-light;
					& > div {
						margin-bottom: 10px;
						span {
							font-size: 16px;
							display: inline-block;
							width: 50%;
						}
					}
				}
				&.right {
					width: 65%;
					& > div {
						display: flex;
						padding-left: 20px;
						&.save {
							justify-content: flex-end;
							.btn {
								max-width: 200px;
							}
						}
						label {
							word-break: break-all;
							padding-top: 5px;
							width: calc(30% - 5px);
							margin-right: 5px;
						}
						.v-text-field {
							width: 70%;
							padding-top: 0;
							&--solo .v-input__control {
								min-height: 38px;
								.v-input__slot {
									margin-bottom: 0;
								}
							}
						}
						.v-select {
							.v-input__slot {
								border: 1px solid $gray-light;
								border-radius: 4px;
								&:before {
									content: none;
								}
							}
						}
						&.meeting-time {
							margin-bottom: 15px;
						}
					}
				}
			}
		}
	}

	.actions-block {
		display: flex;
		justify-content: space-between;
		margin: 30px 0;
		button {
			max-width: 205px;
			margin: 0 7px 0 8px;
		}
		.other {
			display: flex;
			justify-content: flex-end;
			.btn {
				margin: 0;
				min-width: 205px;
			}
		}
	}
	.clients-block {
		.cancel {
			text-align: right;
			div {
				margin-right: 5px;
			}
		}
	}
}
</style>
