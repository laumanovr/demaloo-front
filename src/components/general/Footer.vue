<template>
	<div class="footer-container">
		<div class="footer__content">
			<div class="footer__logo d-flex justify-center">
				<img src="../../assets/images/logo.svg">
				<span>Demaloo</span>
			</div>

			<div class="footer__title">{{$t('slogan')}}</div>
			
			<!--<div class="footer__links d-flex align-center justify-center">-->
				<!--<a href="#">Как устроено Demaloo</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Публичная оферта</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Регистрация компании</a>-->
				<!--<span class="dot"></span>-->
				<!--<a href="#">Часто задаваемые вопросы</a>-->
			<!--</div>-->

            <div class="footer__social d-flex align-center justify-center">
                <a href="https://t.me/demaloo_com" target="_blank">
                    <img src="../../assets/icons/telegram.svg">
                </a>
                <a :href="'https://wa.me/'+'+996500100901'" target="_blank">
                    <img src="../../assets/icons/whats-app.svg">
                </a>
                <a href="https://www.instagram.com/demaloocom" target="_blank">
                    <img src="../../assets/icons/instagram.svg">
                </a>
                <a href="https://www.facebook.com/demaloo" target="_blank">
                    <img src="../../assets/icons/facebook.svg">
                </a>
                <a href="https://www.tiktok.com/@demaloo.com" target="_blank">
                    <img src="../../assets/icons/tiktok.svg">
                </a>
            </div>

			<div class="footer__icons d-flex align-center justify-center">
				<a href="https://apps.apple.com/us/app/demaloo/id1560957584">
					<img src="../../assets/images/app-store.png">
				</a>
				<a href="https://play.google.com/store/apps/details?id=kg.demaloo">
					<img src="../../assets/images/play-market.png">
				</a>
			</div>

			<div class="footer__contacts d-flex align-center justify-center">
				<div class="contact d-flex align-center">
					<img src="../../assets/icons/cell-phone.png" class="phone">
					<a :href="'https://wa.me/'+'+996500100901'" target="_blank">+996 500 100 901</a>
				</div>
				<div class="contact address d-flex align-center">
					<img src="../../assets/icons/marker-dark.png" class="street">
					<span>{{$t('officeAddress')}}, 789065</span>
				</div>
				<div class="contact d-flex align-center">
					<img src="../../assets/icons/envelope-dark.png" class="email">
					<a href="mailto:demaloo.help@gmail.com">demaloo.help@gmail.com</a>
				</div>
			</div>

			<div class="footer__confident">
				© LLC Demaloo, {{$t('allRightsReserved')}},
				<a href="/docs/policy.pdf" target="_blank">{{$t('privacyPolicy')}}</a>,
				<a href="/docs/condition.pdf" target="_blank">{{$t('publicOffer')}}</a>
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
				a:first-child {
					margin-right: 30px;
				}
				img {
					width: 145px;
				}
			}
			&__contacts {
				margin: 40px 0;
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
				a {
					color: #A6ACBB;
					text-decoration: underline;
					&:hover {
						text-decoration: none;
					}
				}
			}
            &__social {
                margin-bottom: 25px;
                a {
                    cursor: pointer;
                    &:not(:last-child) {
                        margin-right: 15px;
                    }
                }
            }
		}
	}
</style>