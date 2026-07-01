import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../apiclient/apiClient";

export interface DBChatMessage {
  id: string;
  sessionId: string;
  sender: 'USER' | 'AGENT' | 'SYSTEM';
  text: string;
  createdAt: string;
}

export interface DBChatSession {
  id: string;
  userId: string;
  status: 'ACTIVE' | 'CLOSED';
  messages: DBChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export const chatKeys = {
  all: ["chat"] as const,
  mySession: () => [...chatKeys.all, "mySession"] as const,
};

export const useMyActiveSessionQuery = () => {
  return useQuery<DBChatSession | null>({
    queryKey: chatKeys.mySession(),
    queryFn: async () => {
      let sessionId = "";
      if (typeof window !== "undefined") {
          sessionId = localStorage.getItem('chatSessionId') || "";
      }
      const response = await apiClient.get<{ success: boolean; data: DBChatSession | null }>(`/chat/my-session${sessionId ? `?sessionId=${sessionId}` : ''}`);
      
      if (response.data.data?.id && typeof window !== "undefined") {
          localStorage.setItem('chatSessionId', response.data.data.id);
      }
      return response.data.data;
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { text: string; sessionId?: string }) => {
      let currentSessionId = payload.sessionId;
      if (!currentSessionId && typeof window !== "undefined") {
          currentSessionId = localStorage.getItem('chatSessionId') || undefined;
      }
      
      const response = await apiClient.post<{ success: boolean; data: DBChatMessage }>("/chat/message", {
          ...payload,
          sessionId: currentSessionId
      });
      
      const newSessionId = response.data.data.sessionId;
      if (newSessionId && typeof window !== "undefined") {
          localStorage.setItem('chatSessionId', newSessionId);
      }
      
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.mySession() });
    },
  });
};

export const useAgentReplyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { text: string; sessionId: string }) => {
      const response = await apiClient.post<{ success: boolean; data: DBChatMessage }>(`/chat/${payload.sessionId}/reply`, { text: payload.text });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.mySession() });
    },
  });
};
