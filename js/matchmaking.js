const supabaseUrl = "VOTRE_SUPABASE_URL";
const supabaseKey = "VOTRE_SUPABASE_ANON_KEY";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const user = JSON.parse(localStorage.getItem('user'));
let opponent = null;

// Chercher un adversaire
async function findOpponent(){
  const { data } = await supabase
    .from('users')
    .select('*')
    .neq('id', user.id)
    .order('elo', {ascending:true})
    .limit(1);

  if(data.length > 0){
    opponent = data[0];
    document.getElementById('status').innerText = `Adversaire trouvé : ${opponent.username}`;
    startGame();
  } else {
    setTimeout(findOpponent, 2000); // réessayer dans 2s
  }
}

findOpponent();