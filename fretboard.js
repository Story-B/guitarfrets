document.addEventListener("DOMContentLoaded", () => {
  const NOTES = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
  const fretboard = document.getElementById("fretboard");
  const fretNumbers = document.getElementById("fret-numbers");
  const tuningSelectors = document.querySelectorAll(".string-tuning");
  const applyButton = document.getElementById("apply-tuning");
  const flipButton = document.getElementById("flip-orientation");
  const scaleSelect = document.getElementById("scale");
  const applyScaleButton = document.getElementById("apply-scale");

  // Create "Clear Highlights" button dynamically
  const clearScaleButton = document.createElement("button");
  clearScaleButton.textContent = "Clear Highlights";
  clearScaleButton.id = "clear-scale";
  scaleSelect.insertAdjacentElement("afterend", clearScaleButton);

  // Fill tuning dropdowns with notes
  tuningSelectors.forEach(select => {
    NOTES.forEach(note => {
      const option = document.createElement("option");
      option.value = note;
      option.textContent = note;
      select.appendChild(option);
    });
  });

  // Default tuning (EADGBE)
  const defaultTuning = ["E", "A", "D", "G", "B", "E"];
  tuningSelectors.forEach((sel, i) => (sel.value = defaultTuning[i]));

  // Orientation and scale state
  let leftHanded = false;
  let currentScaleNotes = [];

  // Build scales automatically
  const SCALES = {};
  const MAJOR_PATTERN = [2, 2, 1, 2, 2, 2, 1];
  const MINOR_PATTERN = [2, 1, 2, 2, 1, 2, 2];

  function buildScale(root, pattern) {
    const rootIndex = NOTES.indexOf(root);
    let notes = [root];
    let i = rootIndex;
    for (let step of pattern) {
      i = (i + step) % NOTES.length;
      notes.push(NOTES[i]);
    }
    return notes.slice(0, 7);
  }

  // Generate all major/minor scales
  for (let note of NOTES) {
    SCALES[`${note}_major`] = buildScale(note, MAJOR_PATTERN);
    SCALES[`${note}_minor`] = buildScale(note, MINOR_PATTERN);
  }

  // Create fret numbers (0–22)
  function generateFretNumbers() {
    fretNumbers.innerHTML = "";
    for (let i = 0; i <= 22; i++) {
      const div = document.createElement("div");
      div.textContent = i;
      fretNumbers.appendChild(div);
    }
  }

  generateFretNumbers();

  function getNoteIndex(note) {
    return NOTES.indexOf(note);
  }

  function generateFretboard(tuning) {
    fretboard.innerHTML = "";
    const frets = 23; // 0–22 frets
    const tuningOrder = leftHanded ? tuning : [...tuning].reverse();

    for (let string = 0; string < 6; string++) {
      let noteIndex = getNoteIndex(tuningOrder[string]);
      for (let fret = 0; fret < frets; fret++) {
        const note = NOTES[(noteIndex + fret) % NOTES.length];
        const div = document.createElement("div");
        div.className = "fret";
        div.textContent = note;

        // Highlight if note is in current scale
        if (currentScaleNotes.includes(note)) {
          div.classList.add("highlight");
        }

        fretboard.appendChild(div);
      }
    }
  }

  // Apply tuning
  applyButton.addEventListener("click", () => {
    const tuning = Array.from(tuningSelectors).map(s => s.value);
    generateFretboard(tuning);
  });

  // Flip orientation
  flipButton.addEventListener("click", () => {
    leftHanded = !leftHanded;
    const tuning = Array.from(tuningSelectors).map(s => s.value);
    generateFretboard(tuning);
  });

  // Highlight selected scale
  applyScaleButton.addEventListener("click", () => {
    const selectedScale = scaleSelect.value;
    currentScaleNotes = SCALES[selectedScale] || [];
    const tuning = Array.from(tuningSelectors).map(s => s.value);
    generateFretboard(tuning);
  });

  // Clear highlights
  clearScaleButton.addEventListener("click", () => {
    currentScaleNotes = [];
    const tuning = Array.from(tuningSelectors).map(s => s.value);
    generateFretboard(tuning);
  });

  // Draw fretboard on load
  generateFretboard(defaultTuning);
});
