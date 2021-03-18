<template>
	<div class="footer-container">
		<div class="footer-content">
			<div class="columns">
				<div class="column">
					<span class="logo">Demaloo</span>
				</div>
				<div class="column">
					<span class="first">Партнерство</span>
					<span>Условия сотрудничества</span>
					<span>Стать партнером</span>
				</div>
				<div class="column">
					<span class="first">Поддержка</span>
					<span>Центр поддежки</span>
					<span>Связаться</span>
				</div>
				<div class="column">
					<span class="first">Скачать приложение</span>
					<span><img src="../../assets/images/app-store.svg"></span>
					<span><img src="../../assets/images/play-market.svg"></span>
				</div>
			</div>
			<div class="cellar">
				<div class="social-net">
					<img src="../../assets/icons/instagram.svg">
					<img src="../../assets/icons/facebook.svg">
				</div>
				<div class="year">© 2021 Demaloo</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	.footer-container {
		border-top: 1px solid $gray-light;
		margin-top: 20px;
		.footer-content {
			max-width: 1366px;
			margin: 0 auto;
			.columns {
				display: flex;
				justify-content: space-evenly;
				border-bottom: 1px solid $gray-light;
				height: 330px;
				padding-top: 60px;
				.column {
					.logo {
						font-size: 25px;
						font-weight: bold;
						color: $indigo-blue;
					}
					span {
						display: block;
						color: $gray-blue;
						font-size: 16px;
						margin-bottom: 14px;
						&.first {
							font-weight: bold;
							font-size: 18px;
						}
					}
				}
			}
			.cellar {
				height: 80px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 60px;
				.social-net {
					display: flex;
					align-items: center;
					img {
						width: 24px;
						height: 24px;
						margin-right: 10px;
					}
				}
				.year {
					color: $gray-blue;
				}
			}
		}
	}
</style>