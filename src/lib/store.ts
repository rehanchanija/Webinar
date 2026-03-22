import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WebinarStatus = 'upcoming' | 'live' | 'completed';
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'none';

export interface Webinar {
  id: string;
  title: string;
  description: string;
  date: string;
  status: WebinarStatus;
  thumbnail: string;
}

export interface Enrollment {
  id: string;
  webinarId: string;
  userId: string;
  status: EnrollmentStatus;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AppStore {
  user: User | null;
  webinars: Webinar[];
  enrollments: Enrollment[];
  login: (email: string, name: string) => void;
  logout: () => void;
  enroll: (webinarId: string) => void;
  setEnrollmentStatus: (enrollmentId: string, status: EnrollmentStatus) => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      user: null as User | null,
      webinars: [
        {
          id: '1',
          title: 'Mastering AI Productivity',
          description: 'Learn how to integrate AI tools into your daily workflow for maximum efficiency.',
          date: '2025-06-15T18:00:00Z',
          status: 'live',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: '2',
          title: 'Next.js 15: What is New?',
          description: 'Deep dive into React Server Components, Server Actions, and the new caching model.',
          date: '2025-07-02T15:00:00Z',
          status: 'upcoming',
          thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: '3',
          title: 'Stripe Integration Guide',
          description: 'Build a full checkout experience and manage subscriptions with ease.',
          date: '2025-05-20T14:00:00Z',
          status: 'completed',
          thumbnail: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: '4',
          title: 'Scaling SaaS Architecture',
          description: 'Strategies for handling millions of users without breaking the bank.',
          date: '2025-08-10T20:00:00Z',
          status: 'upcoming',
          thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: '5',
          title: 'Design Systems for Developers',
          description: 'Bridging the gap between Figma and Tailwind CSS with shared tokens.',
          date: '2025-09-05T16:00:00Z',
          status: 'upcoming',
          thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad4d05942002?auto=format&fit=crop&q=80&w=800',
        },
      ],
      enrollments: [],
      login: (email, name) =>
        set({
          user: { id: 'u1', name, email },
        }),
      logout: () => set({ user: null, enrollments: [] }),
      enroll: (webinarId) =>
        set((state) => {
          if (!state.user) return state;
          const exists = state.enrollments.some((e) => e.webinarId === webinarId && e.userId === state.user?.id);
          if (exists) return state;
          const newEnrollment: Enrollment = {
            id: Math.random().toString(36).substr(2, 9),
            webinarId,
            userId: state.user.id,
            status: 'pending',
          };
          return { enrollments: [...state.enrollments, newEnrollment] };
        }),
      setEnrollmentStatus: (enrollmentId, status) =>
        set((state) => ({
          enrollments: state.enrollments.map((e) =>
            e.id === enrollmentId ? { ...e, status } : e
          ),
        })),
    }),
    {
      name: 'webinar-storage',
    }
  )
);
