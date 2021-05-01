<template>
	<div class="footer-container">
		<div class="footer__content">
			<div class="footer__logo flex justify-center">
				<img src="../../assets/images/logo.svg">
				<span>Demaloo</span>
			</div>

			<div class="footer__title">Отдых без забот</div>
			
			<!--<div class="footer__links flex align-center justify-center">-->
				<!--<a href="#">Как устроено Demaloo</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Публичная оферта</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Регистрация компании</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Часто задаваемые вопросы</a>-->
			<!--</div>-->

			<div class="footer__icons flex align-center justify-center">
				<img src="../../assets/images/app-store.png">
				<img src="../../assets/images/play-market.png">
			</div>

			<div class="footer__contacts flex align-center justify-center">
				<div class="contact flex align-center">
					<img src="../../assets/icons/cell-phone.png" class="phone">
					<span>+996 500 100 901</span>
				</div>
				<div class="contact address flex align-center">
					<img src="../../assets/icons/marker-dark.png" class="street">
					<span>г. Бишкек, ул. Советская 37, 789065</span>
				</div>
				<div class="contact flex align-center">
					<img src="../../assets/icons/envelope-dark.png" class="email">
					<span>info@demaloo.com</span>
				</div>
			</div>

			<div class="footer__confident">
				© LLC Demaloo, Все права защищены, <a>Политика конфидециальности</a>, <a>Публичная оферта</a>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.footer-container {
		padding-top: 25px;
		background: #f5f5f5;
		border-top: 1px solid $gray-light;
		@media #{$mob-view} {
			/*background: #fff;*/
		}
		.footer {
			&__content {
				max-width: 1366px;
				margin: 0 auto;
				text-align: center;
				color: $blue-darkest;
				padding-bottom: 15px;
				@media #{$mob-view} {
					padding: 0 8px 15px;
				}
			}
			&__logo {
				span {
					margin-left: 10px;
					font-size: 20px;
					font-weight: bold;
				}
			}
			&__title {
				color: #284A63;
				font-weight: 600;
				font-size: 18px;
				margin-top: 10px;
				margin-bottom: 18px;
			}
			&__links {
				margin: 35px 0;
				@media #{$mob-view} {
					flex-wrap: wrap;
				}
				a {
					font-size: 14px;
					color: $blue-darkest;
				}
				.dot {
					display: block;
					width: 4px;
					height: 4px;
					background: $blue-darkest;
					border-radius: 4px;
					margin: 0 16px;
				}
			}
			&__icons {
				img {
					width: 145px;
					&:first-child {
						margin-right: 30px;
					}
				}
			}
			&__contacts {
				margin: 40px 0 50px;
				@media #{$mob-view} {
					flex-wrap: wrap;
				}
				.contact {
					font-size: 14px;
					&.address {
						margin: 0 25px;
					}
					img {
						margin-right: 10px;
						&.phone {
							width: 18px;
							height: 18px;
						}
						&.street {
							width: 15px;
							height: 20px;
						}
						&.email {
							width: 18px;
							height: 15px;
						}
					}
				}
			}
			&__confident {
				font-size: 14px;
				color: #A6ACBB;
			}
		}
	}
</style>