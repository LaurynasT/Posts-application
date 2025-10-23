import { createRouter, createWebHistory } from 'vue-router'
import Authors from '@/views/Authors.vue'
import Login from '@/views/Login.vue'
import SinglePost from '@/views/SinglePost.vue'
import NotFound from '@/views/NotFound.vue'
import { useNotificationStore } from '@/stores/notificationStore'
import Posts from '@/views/Posts.vue'
import { getToken } from '@/components/auth/authentication'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/authors',
      name: 'authors',
      component: Authors,
    },
    {
      path: '/',
      alias: '/posts',
      name: 'posts',
      children: [
        {
          path: '',
          name: 'postList',
          component: Posts,
        },
        {
          path: ':id',
          name: 'singlePost',
          component: SinglePost,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },

    {
      path: '/:catchall(.*)',
      name: 'notfound',
      component: NotFound,
    },
  ],
})

router.afterEach(() => {
  const store = useNotificationStore()
  store.clear()
})
router.beforeEach((to, from, next) => {
  const loggedIn = !!getToken()

  if (to.path === '/login' && loggedIn) {
    next('/posts')
    next('/posts')
  } else {
    next()
    next()
  }
})

export default router
