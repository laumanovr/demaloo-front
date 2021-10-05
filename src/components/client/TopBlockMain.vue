<template>
    <div>
        <div class="main-top-bg web">
            <img src="@/assets/images/main-page-bg.png">
            <div class="bg-text">
                <div class="bg-text__block">
                    <div class="bg-text__top">{{$t('mainPage.bannerTopTitle')}}</div>
                    <div class="bg-text__bottom">{{$t('mainPage.bannerBottomTitle')}}.</div>
                    <div class="d-flex justify-center switchers">
                        <router-link to="/" class="d-flex align-center switcher" :class="{'active': isTour}">
                            <inline-svg :src="require('@/assets/icons/local-tour.svg')" :fill="tourColor"/>
                            Туры
                        </router-link>
                        <router-link to="/activities" class="d-flex align-center switcher" :class="{'active': isActivity}">
                            <inline-svg :src="require('@/assets/icons/activity.svg')" :fill="activityColor"/>
                            Развлечения
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div class="switchers mob">
            <router-link to="/" class="d-flex align-center switcher" :class="{'active': isTour}">
                <inline-svg :src="require('@/assets/icons/local-tour.svg')" :fill="tourColor"/>
                Туры
            </router-link>
            <router-link to="/activities" class="d-flex align-center switcher" :class="{'active': isActivity}">
                <inline-svg :src="require('@/assets/icons/activity.svg')" :fill="activityColor"/>
                Развлечения
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
	props: {
		tourColor: String,
		activityColor: String,
		isTour: Boolean,
		isActivity: Boolean
	}
};
</script>