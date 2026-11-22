export const ROUTES = {
    LOGIN: {
        path: '/login',
        name: 'Login',
        icon: 'login'
    },
    REGISTER: {              
        path: '/register',
        name: 'Register',
        icon: 'person_add'
    },
    HOME: {
        path: '/',
        name: 'Home',
        icon: 'home'
    },
    ESTOQUE: {
        path: '/estoque',
        name: 'Estoque',
        icon: 'store'
    },
    DESPESAS: {
        path: '/despesas',
        name: 'Despesas',
        icon: 'attach_money'
    },
    ITEMS: {
        path: '/items',
        name: 'Items',
        icon: 'inventory'
    },
    SERVICOS: {
        path: '/servicos',
        name: 'Serviços',
        icon: 'build'
    },
    PRESTADOR: {
        path: '/meus-dados',
        name: 'Meus dados',
        icon: 'badge'
    },
}

// Página do recibo/orçamento. Fica fora de ROUTES porque não aparece no menu lateral.
export const DOCUMENTO_SERVICO_PATH = '/documento/servico/:id';
export const documentoServicoUrl = (idServico) => `/documento/servico/${idServico}`;