// --- Initialisation Supabase ---
const supabaseUrl = "VOTRE_SUPABASE_URL";
const supabaseKey = "VOTRE_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- Attendre que le DOM soit chargé ---
window.addEventListener('DOMContentLoaded', () => {

  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  // --- Inscription ---
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page

    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();

    if(!username || !password){
      alert("Remplis tous les champs !");
      return;
    }

    try {
      // Créer compte Supabase Auth (email factice)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: username + "@test.com",
        password: password
      });

      if(authError){
        alert("Erreur inscription : " + authError.message);
        return;
      }

      // Stocker pseudo et Elo dans la table 'users'
      const { data, error } = await supabase
        .from('users')
        .insert([{ id: authData.user.id, username: username, elo: 1000 }]);

      if(error){
        alert("Erreur table users : " + error.message);
      } else {
        alert("Inscription réussie !");
        signupForm.reset();
      }

    } catch(err){
      console.error(err);
      alert("Erreur inattendue !");
    }
  });

  // --- Connexion ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if(!username || !password){
      alert("Remplis tous les champs !");
      return;
    }

    try {
      // Connexion Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: username + "@test.com",
        password: password
      });

      if(authError){
        alert("Erreur connexion : " + authError.message);
        return;
      }

      // Récupérer les infos utilisateur depuis la table 'users'
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if(error){
        alert("Erreur récupération utilisateur : " + error.message);
        return;
      }

      // Stocker localement et rediriger vers le jeu
      localStorage.setItem('user', JSON.stringify(userData));
      window.location.href = "game.html";

    } catch(err){
      console.error(err);
      alert("Erreur inattendue !");
    }
  });

});