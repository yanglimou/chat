
import Vue from "vue"
import axios from "axios"
import Vuex from "vuex" //引入vuex
Vue.use(Vuex) //使用vuex
import { wsmessage2data, data2wsmessage, localmessage2data } from '../lib/sparrowChat'
export default new Vuex.Store({
    state: {
        sessions: [],
        contacts: [],
        ws: null,
        userId: null,
    },
    getters: {
        getSessionById: (state) => (id) => {
            return state.sessions.find(session => session.chatSession.sessionKey === id)
        },
        getUserById: (state) => (userId) => {
            if (state.contacts.users) {
                return state.contacts.users.find(user => user.userId === userId)
            }
            return null
        },
        getUserImageById: (state) => (userId) => {
            if (state.contacts.users) {
                const user = state.contacts.users.find(user => user.userId === userId)
                if (user) {
                    return user.avatar
                }
            }
            return null
        },
        getQunById: (state) => (qunId) => {
            if (state.contacts.quns) {
                return state.contacts.quns.find(qun => qun.qunId === qunId)
            }
            return null
        }
    },
    mutations: {
        setUserId(state, userId) {
            state.userId = userId
        },
        setSessions(state, sessions) {
            state.sessions = sessions;
        },
        setLastReadTime(state, sessionKey) {
            state.sessions.find(session => session.chatSession.sessionKey === sessionKey).lastReadTime = Date.now()
        },
        setContacts(state, contacts) {
            state.contacts = contacts;
        },
        addSession(state, session) {
            state.sessions.push(session)
        },
        removeMessage(state, { sessionKey, clientSendTime }) {
            const session = state.sessions.find(session => session.chatSession.sessionKey === sessionKey)
            console.log("removeMessage", session)
            if (session) {
                session.messages = session.messages.filter(message => message.clientSendTime !== clientSendTime)
            }
        }
    },
    actions: {
        initWs(context) {
            console.log("current user:" + context.state.userId)
            context.state.ws = new WebSocket("ws://chat.sparrowzoo.com/websocket", [context.state.userId]);
            //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
            context.state.ws.onopen = function (e) {
                //当WebSocket创建成功时，触发onopen事件
                console.log("open");
            }
            context.state.ws.onmessage = async (e) => {
                const result = await wsmessage2data(e.data)
                console.log(result)
                if (result.chatType === 2) {
                    //取消的逻辑//修改本地数据
                    context.commit('removeMessage', { sessionKey: result.sessionKey, clientSendTime: result.clientSendTime })
                } else {
                    //其他消息的逻辑
                    let session = context.getters.getSessionById(result.session)
                    console.log(session)
                    if (session) {
                        session.messages.push(result)
                    }
                }
            }
            context.state.ws.onclose = function (e) {
                //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
                console.log("close");
            }
            context.state.ws.onerror = function (e) {
                //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
                console.log(e);
            }
        },
        sendMessage(context, { chatType, msgType, from, to, sessionKey, msg, image, clientSendTime }) {
            console.log(context, chatType, msgType, from, to, sessionKey, msg)
            const result = data2wsmessage(chatType, msgType, from, to, sessionKey, msg, clientSendTime)
            console.log(result);
            context.state.ws.send(result)

            const localresult = localmessage2data(chatType, msgType, from, to, sessionKey, msg, image, clientSendTime)
            console.log(localresult)
            let session = context.getters.getSessionById(localresult.session)
            console.log(session)
            if (session) {
                session.messages.push(localresult)
            }
        },
        async readSession(context, sessionKey) {
            // 修改远程数据
            const session = context.getters.getSessionById(sessionKey);
            const res = await axios.post(`chat/session/read`, {
                chatType: session.chatSession.chatType,
                sessionKey: session.chatSession.sessionKey,
                userId: session.chatSession.me
            })
            //修改本地数据
            context.commit('setLastReadTime', sessionKey)

        },

        async cancelMessage(context, { fromUserId, clientSendTime, sessionKey, chatType }) {
            console.log(context, fromUserId, clientSendTime, sessionKey, chatType)
            // 修改远程数据
            const res = await axios.post(`chat/cancel`, {
                fromUserId: fromUserId,
                clientSendTime: clientSendTime + "",
                sessionKey: sessionKey,
                chatType: chatType,
            })
            if (res === true) {
                //修改本地数据
                context.commit('removeMessage', { sessionKey, clientSendTime })
            }
        },
    },
    modules: {

    }
})