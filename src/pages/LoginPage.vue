<script>
import {axiosInstance} from '../assets/axios'
//TEMPORARY TEST PAGE
export default{
    name: 'LoginPage',
    data(){
        return{
            form:{
                email: '',
                password:''
            }
        }
    },
    methods:{
        attemptLogin(){
            axiosInstance.get('/sanctum/csrf-cookie').then(()=>{
                const payload = this.form;
                axiosInstance.post('/api/login', payload).catch(err=>{
                    console.log(err);
                })
                
            });
        },
        async test(){
            try{
                await axiosInstance.get('/api/test');
            } catch(err){
                console.error(test);
            }
        }
    }
}
</script>

<template>
    <form @submit.prevent="attemptLogin" novalidate>
        <input type="email" v-model="form.email">
        <input type="password" v-model="form.password">
        <button>login</button>
    </form>
</template>