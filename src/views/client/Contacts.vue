<template>
	<div class="contact-container">
		<div class="content-block">
			<div class="head-title">О нас</div>
			<div class="d-flex justify-center logo">
				<img src="../../assets/images/logo-text.svg">
			</div>

			<div class="purpose"><span>Мы путешественники.</span> Мы верим, что путешествия меняют жизнь.</div>
			<div class="purpose middle"><span>Наша цель,</span> создать отличный продукт и облегчить связь между
				путешественниками и туроператорами, которые дарят нам незабываемые эмоции.
			</div>
			<div class="purpose">
				Инвестируя в технологии, которые помогают путешествовать без забот,
				<a href="https://demaloo.com/">Demaloo.com</a>
				предлагает путешественникам потрясающие варианты туров.
			</div>

			<div class="phone-contacts text-center">
				<p class="font-bold phone">Контакты</p>
				<div class="d-flex align-center justify-center flex-wrap">
					<div class="d-flex align-center">
						<img src="../../assets/icons/whatsapp-icon.svg">
						<span>+996 500 100 901</span>
					</div>
					<div class="d-flex align-center second">
						<img src="../../assets/icons/contact-icon.svg">
						<span>+996 500 100 901</span>
					</div>
					<div class="d-flex align-center">
						<img src="../../assets/icons/telegram-icon.svg">
						<span>@Akyl_1</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.contact-container {
		background: #f5f5f5;
		display: flex;
		min-height: 70vh;
		.content-block {
			max-width: 1200px;
			max-height: 675px;
			margin: 20px auto;
			background: #fff;
			padding: 25px 25px 70px;
			font-size: 16px;
			color: #153243;
			border-radius: 7px;
			.logo {
				margin-bottom: 50px;
			}
			.purpose {
				&.middle {
					margin: 20px 0;
				}
				span {
					font-weight: 700;
				}
				a {
					color: $green-main;
				}
			}
			.phone {
				margin-top: 30px;
			}
			.phone-contacts {
				.d-flex {
					margin-bottom: 10px;
				}
				.second {
					margin: 0 30px 10px;
				}
				span {
					margin-left: 10px;
				}
			}
		}
	}
</style>