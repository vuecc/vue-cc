<template>
    <div class="application-title-bar" v-bind:class="[{ 'login-title-bar': isLogin }, { 'main-title-bar': isMain }]">
        <div class="window-button">
            <div class="win_button win_min" @click="minWindow()"></div>
            <div class="win_button win_max" @click="maxWindow()"></div>
            <div class="win_button win_close" @click="closeWindow()"></div>
        </div>
    </div>
</template>

<script>

import nativeService from '@/components/Common/Services/NativeService';

export default {
    name: 'ApplicationButtons',
    props: ['type'],
    data: function () {
        return {
            isLogin: false,
            isMain: false
        }
    },
    created: function () {
        switch (this.type) {
            case 'login':
                this.isLogin = true;
                break;
            case 'main':
                this.isMain = true;
                break;
            default:
                break;
        }
    },
    methods: {
        minWindow: function () {
            nativeService.min();
        },
        maxWindow: function () {
            nativeService.max();
        },
        closeWindow: function () {
            nativeService.close();
        },
    }
}
</script>

<style scoped>
.application-title-bar {
    -webkit-app-region: drag;
    position: fixed;
    display: block;
    top: 0;
    right: 0;
}

.login-title-bar {
    width: 100%;
    height: 50px;
}

.main-title-bar {
    width:  calc(100% - 60px);
    height: 50px;
}

.window-button {
    font-size: 0;
    width: 95px;
    height: 37px;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 100;
}

.win_button {
    width: 30px;
    height: 37px;
    display: inline-block;
    cursor: pointer;
}

.win_button.win_min {
    background-image: url(./images/min.png);
}

.win_button.win_max {
    background-image: url(./images/max.png);
}

.win_button.win_res {
    background-image: url(./images/res.png);
}

.win_button.win_close {
    background-image: url(./images/close.png);
}

.win_button.win_min:hover {
    background-image: url(./images/min_sel.png);
    background-color: #249bef;
}

.win_button.win_max:hover {
    background-image: url(./images/max_sel.png);
    background-color: #249bef;
}

.win_button.win_res:hover {
    background-image: url(./images/res_sel.png);
    background-color: #249bef;
}

.win_button.win_close:hover {
    background-image: url(./images/close_sel.png);
    background-color: #eb4242;
}
</style>