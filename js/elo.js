function updateElo(Ranchien, Radversaire, S){
  return Ranchien + 16 * (S - (1 / (1 + 10 ** ((Radversaire - Ranchien) / 400))));
}