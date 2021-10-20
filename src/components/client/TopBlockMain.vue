<template>
    <div>
        <div class="main-top-bg web">
            <img src="@/assets/images/main-page-bg.png">
            <div class="bg-text">
                <div class="bg-text__block">
                    <div class="bg-text__top">{{$t('mainPage.bannerTopTitle')}}</div>
                    <div class="bg-text__bottom">{{$t('mainPage.bannerBottomTitle')}}.</div>
                    <div class="d-flex justify-center switchers">
                        <router-link to="/" class="d-flex align-center switcher">
                            <inline-svg :src="require('@/assets/icons/popcorn.svg')" :fill="isActive('/')"/>
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
            <router-link to="/" class="d-flex align-center switcher">
                <inline-svg :src="require('@/assets/icons/popcorn.svg')" :fill="isActive('/')"/>
                <template v-if="$route.path === '/'">Развлечения</template>
            </router-link>
            <router-link to="/events" class="d-flex align-center switcher">
                <inline-svg :src="require('@/assets/icons/event.svg')" :fill="isActive('/events')"/>
                <template v-if="$route.path === '/events'">Мероприятия</template>
            </router-link>
            <router-link to="/tours" class="d-flex align-center switcher">
                <inline-svg :src="require('@/assets/icons/local-tour.svg')" :fill="isActive('/tours')"/>
                <template v-if="$route.path === '/tours'">Туры</template>
            </router-link>
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
                    width: 50%;
                }
            }

            @media #{$mob-view} {
                padding: 17px 5px;
                border-radius: 0;
                width: 25%;
                justify-content: center;
                margin: 0 !important;
                &:not(:last-child) {
                    border-right: 1px solid $gray-light;
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