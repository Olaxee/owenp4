const supabaseUrl = "VOTRE_SUPABASE_URL";
const supabaseKey = "VOTRE_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- Inscription ---
document.getElementById('signupForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  // Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: username+"@test.com",
    password: password
  });

  if(authError){
    alert("Erreur inscription : " + authError.message);
    return;
  }

  // Stocker pseudo et Elo
  const { data, error } = await supabase
    .from('users')
    .insert([{ id: authData.user.id, username, elo: 1000 }]);

  if(error) alert("Erreur table users : " + error.message);
  else alert("Inscription réussie !");
});

// --- Connexion ---
document.getElementById('loginForm').addEventListener('submit', async e=>{
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: username+"@test.com",
    password: password
  });

  if(authError){
    alert("Erreur connexion : " + authError.message);
    return;
  }

  // Récupérer les infos de l'utilisateur
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  localStorage.setItem('user', JSON.stringify(userData));
  window.location.href = "game.html";
});