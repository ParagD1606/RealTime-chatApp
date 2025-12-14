import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { sendMessage } from "../../../backend/src/controllers/message.controller";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get)=>({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers: async()=>{
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get("/messages/users")
            set({users: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isUsersLoading: false})
        }
    },

    getMessages: async()=>{
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${users}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async (messageData)=>{
        get({selectedUser, messages}) = get()
        try {
            const res = await axiosInstance.post(`/messages/send/${selected}`, messageData)
            set({message: [...message, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: ()=>{
        const {selectedUser} = get()
        if(!selectedUser) return

        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if(!isMessageSentFromSelectedUser) return
            set({
                messages: [...get(). messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket

        socket.off("newMessage")
        
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),
}))