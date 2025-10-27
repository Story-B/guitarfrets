// List of all notes in the chromatic scale
const NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];

// Grab elements from the HTML
const fretboard = document.getElementById("fretboard");
const tuningSelectors = document.querySelectorAll(".string-tuning");
const applyButton = document.getElementById("apply-tuning");
const flipButton = document.getElementById("flip-orientation");

// Fill each string dropdown with all note options
tuningSelectors.forEach(select => {
  NOTES.forEach(note => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    select.appendChild(option);
  });
});

// Default tuning = standard EADGBE
const defaultTuning = ["E", "A", "D", "G", "B", "E"];
tuningSelectors.forEach((sel, i) => {
  sel.value = defaultTuning[i];
});

// Keeps track of whether we're in left- or right-handed mode
let leftHanded = false;

// Helper to get the index of a note
function getNoteIndex(note) {
  return NOTES.indexOf(note);
}

// Builds the fretboard
function generateFretboard(tuning) {
  fretboard.innerHTML = "";
  const frets = 13; // show 0–12 frets

  // Decide string order based on orientation
  const tuningOrder = leftHanded ? tuning : [...tuning].reverse();

  for (let string = 0; string < 6; string++) {
    let noteIndex = getNoteIndex(tuningOrder[string]);
    for (let fret = 0; fret < frets; fret++) {
      const note = NOTES[(noteIndex + fret) % NOTES.length];
      const div = document.createElement("div");
      div.className = "fret";
      div.textContent = note;
      fretboard.appendChild(div);
    }
  }
}

// When "Apply Tuning" is clicked
applyButton.addEventListener("click", () => {
  const tuning = Array.from(tuningSelectors).map(s => s.value);
  generateFretboard(tuning);
});

// When "Flip Orientation" is clicked
flipButton.addEventListener("click", () => {
  leftHanded = !leftHanded; // toggle between true/false
  const tuning = Array.from(tuningSelectors).map(s => s.value);
  generateFretboard(tuning);
});

// Draw the initial fretboard
generateFretboard(defaultTuning);
