// frontend/src/store/useChatStore.js

import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
// ❌ REMOVE THIS LINE (if you didn't already):
// import { sendMessage } from "../../../backend/src/controllers/message.controller";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get)=>({
    messages: [], // Corrected state key to 'messages'
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

    // Fixed logic to use userToChatId
    getMessages: async(userToChatId)=>{
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/messages/${userToChatId}`)
            set({messages: res.data})
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isMessagesLoading: false})
        }
    },

    // Fixed destructuring and used correct variable/state names
    sendMessage: async (messageData)=>{
        const {selectedUser, messages} = get() 
        if(!selectedUser) return;
        
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessages: ()=>{
        const {selectedUser} = get()
        if(!selectedUser) return

        const socket = useAuthStore.getState().socket
        if(!socket) return

        socket.on("newMessage", (newMessage)=>{
            const isMessageFromSelectedUser = newMessage.senderId === selectedUser._id
            
            if(isMessageFromSelectedUser){
                set({
                    messages: [...get().messages, newMessage]
                })
            }
        })
    },

    unsubscribeFromMessages: ()=>{
        const socket = useAuthStore.getState().socket
        if(socket) {
            socket.off("newMessage")
        }
    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),
}))