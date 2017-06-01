<template>
    <div>
        <ApplicationButtons type="login"></ApplicationButtons>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" class="login-form">
            <Form-item prop="userName">
                <Input type="text" v-model="formInline.userName" placeholder="Username" :readonly="formInline.userNameReadonly">
                <Icon type="ios-person-outline" slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Form-item prop="passWord">
                <Input type="password" v-model="formInline.passWord" placeholder="Password" :readonly="formInline.passWordReadonly">
                <Icon type="ios-locked-outline" slot="prepend"></Icon>
                </Input>
            </Form-item>
            <Form-item>
                <Button type="primary" @click="handleSubmit(formInline)" :loading="isLogin">登陆</Button>
            </Form-item>
        </Form>
    </div>
</template>

<script>

import ApplicationButtons from '@/components/Common/ApplicationButtons';
import EncryptService from '@/components/Common/Services/EncryptService';
import httpservice from '@/components/Common/Services/HttpService';

export default {
    name: 'login',
    components: {
        ApplicationButtons
    },
    data() {
        return {
            isLogin: false,
            formInline: {
                userName: '',
                passWord: '',
                userNameReadonly: false,
                passWordReadonly: false
            },
            ruleInline: {
                userName: [
                    { required: true, message: '请填写用户名', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        handleSubmit: function (formInline) {
            let self = this;
            let instance = httpservice.getAxios;
            let userName = encodeURIComponent(formInline.userName);
            let passWord = encodeURIComponent(EncryptService.encrypt(formInline.passWord, formInline.userName));
            self.$Loading.start();
            self.isLogin = true;
            formInline.userNameReadonly = true;
            formInline.passWordReadonly = true;
            instance.post('/login', "userName=" + userName + "&password=" + passWord + "&loginCode=&loginType=1&deviceId=00%3A15%3A5d%3A04%3A0f%3A00").then(function (response) {
                let user = response.data;
                self.isLogin = false;
                if (user.errorCode == 0) {
                    self.$store.commit('updateCurrentUser', {
                        user: user
                    });
                    self.$Loading.finish();
                    self.$router.push({ path: 'Home' })
                } else {
                    formInline.userNameReadonly = false;
                    formInline.passWordReadonly = false;
                    self.$Loading.error();
                    self.$Notice.open({
                        title: '登录失败',
                        desc: user.errorMessage
                    });
                }
            });
        }
    }
}
</script>

<style scoped>
.login-form {
    margin: auto;
    margin-top: 10%;
    width: 260px;
    text-align: center;
    padding: 30px 30px 10px 30px;
    background-color: white;
    border-radius: 10%;
}
</style>