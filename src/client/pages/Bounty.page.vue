<template>

    <div>

        <layout class="bountyProgramPage" v-show="!protocolUsedOnMultipleTabs">

            <div slot="content">

                <ranking-list/>

            </div>

        </layout>

        <multiple-tabs v-show="protocolUsedOnMultipleTabs"/>

    </div>

</template>

<script>

    import Layout from "client/components/layout/Layout.vue";
    import RankingList from "client/components/heros/bounty/Ranking-List.hero.vue";
    import MultipleTabs from "../components/heros/Multiple-Tabs.hero.vue";
    import WebDollarEmitter from "../../utils/WebDollarEmitter";

    export default {

        name: "ViewHome",

        components:{
            Layout,
            RankingList,
            MultipleTabs
        },

        data: () => {
            return {
                protocolUsedOnMultipleTabs: false
            }
        },

        methods: {
            _blockchainStatus(data) {
                if (data.message === "Single Window") {
                    this.protocolUsedOnMultipleTabs = false;
                } else if (data.message === "Multiple Windows Detected") {
                    this.protocolUsedOnMultipleTabs = true;
                }
            }
        },

        mounted(){
            const self = this;

            this.$nextTick(() => {
                WebDollarEmitter.on('blockchain/status', self._blockchainStatus);
            });
        },

        destroyed() {
            WebDollarEmitter.off('blockchain/status', this._blockchainStatus);
        }
    }

</script>
