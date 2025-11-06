document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabCadastro = document.getElementById('tab-cadastro');
    const formLogin = document.getElementById('form-login');
    const formCadastro = document.getElementById('form-cadastro');

    if (tabLogin && tabCadastro && formLogin && formCadastro) {
        
        const handleTabClick = (activeTab, inactiveTab, activeForm, inactiveForm) => {
            activeTab.classList.add('active');
            inactiveTab.classList.remove('active');
            activeForm.style.display = 'block';
            inactiveForm.style.display = 'none';
        };

        tabLogin.addEventListener('click', () => {
            handleTabClick(tabLogin, tabCadastro, formLogin, formCadastro);
        });

        tabCadastro.addEventListener('click', () => {
            handleTabClick(tabCadastro, tabLogin, formCadastro, formLogin);
        });
        
        // Garante que o estado inicial é o Login
        handleTabClick(tabLogin, tabCadastro, formLogin, formCadastro);
    }
});