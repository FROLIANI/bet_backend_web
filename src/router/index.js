import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '@/views/LoginForm.vue'
import Schema from '@/components/Schema.vue'
import Dashboard from '@/views/Dashboard.vue'
import Posts from '@/views/Posts.vue'
import Categories from '@/views/Categories.vue'
import Users from '@/views/Users.vue'
import PublishedPost from '@/views/PublishedPost.vue'
import DraftedPost from '@/views/DraftedPost.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginForm,
    },
    {
      path: '/dashboard',
      component: Schema,
      children: [
        {
          path: '',
          component: Dashboard,
          meta: { title: 'Dashboard' }
        },
        {
          path: '/posts',
          component: Posts,
          meta: { title: 'Posts' }
        },
        {
          path: '/published',
          component: PublishedPost,
          meta: { title: 'Published' }
        },
        {
          path: '/drafted',
          component: DraftedPost,
          meta: { title: 'Drafted' }
        },
        {
          path: '/categories',
          component: Categories,
          meta: { title: 'Categories' }
        },
        {
          path: '/users',
          component: Users,
          meta: { title: 'Users' }
        },
        
      ],
      meta: { requiresAuth: true },
    }
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('auth'); 
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router
