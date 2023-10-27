<script>
import axios from 'axios';
import { axiosInstance } from '../assets/axios';
import MessageLoader from './MessageLoader.vue';
const baseUri = 'api/apartments';

export default {

    data() {
        return {
            form: {
                content: '',
                name: '',
                email: ''
            },
            messageSend: false,
            isLoading: false,
            errors: {}
        }
    },
    components: { MessageLoader },
    props: {
        apartment: Object,
    },


    methods: {

        toggleMessage() {
            this.messageSend = false
            this.form = {
                content: '',
                name: '',
                email: ''
            }
        },

        formValidation() {
            if (!this.form.email.length) { this.errors.email = "L'indirizzo email  è obbligatiorio" }
            else if (!this.form.email.includes('@') || this.form.email.length < 5) { this.errors.email = "L'indirizzo email non è valido" }
            if (!this.form.name.length) { this.errors.name = "Il nome  è obbligatiorio" }
            if (!this.form.content.length) { this.errors.content = "Il messaggio è obbligatiorio" }
            if (this.form.name.length > 40) { this.errors.name = 'Il nome può essere lungo al massimo 40 caratteri' }
            if (this.form.content.length > 350) { this.errors.content = 'Il messaggio può essere lungo al massimo 350 caratteri' }
        },


        refreshErrors(field) {
            this.errors[field] = ''
        },

        handleSubmit() {
            this.errors = {};
            this.formValidation();
            if (Object.keys(this.errors).length) return;
            this.messageSend = false
            this.isLoading = true
            axiosInstance.post(`${baseUri}/${this.apartment.slug}/messages/send`, this.form)
                .then(res => this.messageSend = true)
                .catch(err => {
                    const { errors } = err.response.data
                    const errorMessage = {}
                    for (let field in errors) errorMessage[field] = errors[field][0];
                    this.errors = errorMessage
                })
                .then(() => { this.isLoading = false })
        }
    },

}
</script>   




<template>
    <div class="card border rounded border-secondary-subtle" v-show="!messageSend">
        <div class="card-body d-flex align-items-center flex-column">
            <h4 class="card-title align-self-start">Contatta il proprietario</h4>
            <h6 class="card-subtitle mb-2 text-body-secondary py-2 align-self-start">
                <span class="fw-semibold">{{ apartment.name }}</span>
                - {{ apartment.address }}
            </h6>
            <form action="#" class="row px-3 g-2" @submit.prevent="handleSubmit" novalidate>
                <textarea name="content" id="content" cols="40" rows="4"
                    :class="[{ 'is-invalid': errors.content }, 'form-control', 'col']" placeholder="Messaggio*"
                    v-model.trim="form.content" @input="refreshErrors('content')"></textarea>
                <div class="invalid-feedback my-2">
                    {{ errors.content }}
                </div>
                <input type="text" name="name" id="name" placeholder="Nome*"
                    :class="[{ 'is-invalid': errors.name }, 'form-control']" v-model.trim="form.name"
                    @input="refreshErrors('name')">
                <div class="invalid-feedback my-2" v-if="errors.name">
                    {{ errors.name }}
                </div>
                <input type="text" name="email" id="email" placeholder="Email*"
                    :class="[{ 'is-invalid': errors.email }, 'form-control']" v-model.trim="form.email"
                    @input="refreshErrors('email')">
                <div class="invalid-feedback my-2" v-if="errors.email">
                    {{ errors.email }}
                </div>
                <p class="text-end">*campi obbligatori</p>
                <div>
                    <button type="submit" class="btn btn-primary"><font-awesome-icon :icon="['fas', 'paper-plane']" />
                        Invia Messaggio</button>
                </div>
            </form>
        </div>
        <MessageLoader v-show="isLoading" />
    </div>
    <div class="card border rounded border-secondary-subtle" v-show="messageSend">
        <div class="card-body d-flex align-items-center flex-column">
            <h4 class="card-title align-self-start">Messaggio inviato con successo</h4>
            <h6 class="card-subtitle mb-2 text-body-secondary py-2 align-self-start">
                Vuoi inviare un altro messaggio ?
            </h6>
            <div>
                <button @click="toggleMessage" type="submit" class="btn btn-primary"><font-awesome-icon
                        :icon="['fas', 'paper-plane']" />
                    Invia un altro messaggio</button>
            </div>
        </div>
    </div>
</template>







<style></style>