<template>
    <div>
        <div class="main-top-bg web">
            <img src="@/assets/images/main-page-bg.png">
            <div class="bg-text">
                <div class="bg-text__block">
                    <div class="bg-text__top">{{$t('mainPage.bannerTopTitle')}}</div>
                    <div class="bg-text__bottom">{{$t('mainPage.bannerBottomTitle')}}.</div>
                    <div class="d-flex justify-center switchers">
                        <router-link to="/activities" class="d-flex align-center switcher">
                            <inline-svg :src="require('@/assets/icons/popcorn.svg')" :fill="isActive('/activities')"/>
                            Развлечения
                        </router-link>
                        <router-link to="/events" class="d-flex align-center switcher">
                            <inline-svg :src="require('@/assets/icons/event.svg')" :fill="isActive('/events')"/>
                            Мероприятия
                        </router-link>
                        <router-link to="/tours" class="d-flex align-center switcher">
                            <inline-svg :src="require('@/assets/icons/local-tour.svg')" :fill="isActive('/tours')"/>
                            Туры
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="switchers mob">
            <router-link to="/" class="d-flex align-center switcher">Все</router-link>
            <router-link to="/activities" class="d-flex align-center switcher">Развлечения</router-link>
            <router-link to="/events" class="d-flex align-center switcher">Мероприятия</router-link>
            <router-link to="/tours" class="d-flex align-center switcher">Туры</router-link>
        </div>
    </div>
</template>

<script>
export default {
	methods: {
		isActive(tab) {
			return this.$route.path === tab ? '#02D0AA' : '#102542';
		}
	}
};
</script>

<style lang="scss">
    .switchers {
        transform: translateY(25px);
        @media #{$mob-view} {
            transform: translateY(0);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .switcher {
            color: $blue-darkest;
            padding: 15px 30px;
            border-radius: 7px;
            background: #fff;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;

            &:nth-child(2) {
                margin: 0 20px;
            }

            svg {
                margin-right: 8px;
            }

            &.router-link-exact-active {
                color: $green-main;
                @media #{$mob-view} {
                    border-bottom: 2px solid $green-main;
                }
            }

            @media #{$mob-view} {
                padding: 17px 5px;
                border-radius: 0;
                justify-content: center;
                margin: 0 !important;
                text-transform: uppercase;
                &:first-child {
                    width: 15%;
                }
                &:nth-child(2) {
                    width: 35%;
                }
                &:nth-child(3) {
                    width: 35%;
                }
                &:nth-child(4) {
                    width: 15%;
                }
            }
        }
    }

    .main-top-bg {
        position: relative;
        height: 350px;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .bg-text {
            color: #fff;
            position: absolute;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #00000080;
            height: 100%;
            width: 100%;

            &__block {
                text-align: center;
                transform: translateY(-20px);
            }

            &__top {
                font-weight: bold;
                font-size: 48px;
                font-family: $montserrat;
            }

            &__bottom {
                font-weight: 500;
                font-size: 22px;
                font-family: $montserrat;
            }
        }
    }
</style>