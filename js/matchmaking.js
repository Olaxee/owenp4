const supabaseUrl = "https://onvmbhazjlivjedwdusp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9udm1iaGF6amxpdmplZHdkdXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzExNzcsImV4cCI6MjA3NzUwNzE3N30.669S7AH9jVtQrDDG7FESAFIgXX04ul2l4TQwBUfjMCo";
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