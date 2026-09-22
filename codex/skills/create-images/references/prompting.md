# Prompting image models

## Whole-scene prompts

- Open with what kind of image it is; for a photo, "a real, unedited photograph by a professional photographer, not a render, illustration or composite." Never ask for "8K", "ultra-detailed", "HDR" or "cinematic"; they add fake texture and halos.
- Describe how the picture will be used instead of giving coordinates: where text, buttons or a menu bar will sit, what must stay calm there, and which parts must stay clear. Models ignore percentages and pixel positions, but follow plain-language placement ("just right of the centre, in the lower third").
- Give each subject its own line: species or exact identity, the traits that identify it, pose or action, what it stands or sits on, size relative to the frame, and where it is. For a subject or addition meant to be noticed, describe the size, placement, and contrast that make it recognizable in the uncropped image at its actual viewing size; required lettering must be legible there too. Keep intentionally unobtrusive retouches and material details subtle.
- Make animals do something (calling, singing, leaping, feeding, swimming) rather than sit, when the brief wants life. Name the real posture for a behaviour, because "singing" alone gives a shouting bird; describe the actual posture or attach a photo of it.
- Name references by number and say what each is for and what to ignore: "Image 2 is the exact car from the front; ignore its colour, plate holder and background." Attach a reference for every hard-to-describe subject; text alone gives toys and generic species.
- For a specific product or vehicle, state the exact model, variant and options, describe the features that models get wrong (light units, grille pattern, wheels, badges, interior colour) precisely and correctly from the references, and say what must not appear (hybrid badges, plates, people inside).
- End with exclusions. No text or lettering except real badges and lettering required by the brief; no signs unless required by the brief; no watermarks, borders, or extra animals.
- Long prompts may be turned into attachments by chat interfaces; check the text actually landed in the message box before sending.

## Edits and section redraws

- The model copies the input image more faithfully than it follows text. Prepare the actual scene as the edit target, preserving what should stay. Erase a wrong detail completely with a smooth fill of its surroundings that keeps none of its outline. When a subject's existing silhouette encodes the wrong placement or support contact, erase the complete conflicting subject silhouette, then place a simple, clean guide for the whole subject at the requested placement, with contact on the actual support where applicable. If the old subject is needed for its appearance, supply it only as a separate reference and say to ignore its placement and support contact. For a style, material, or detail repair whose placement and support contact are already correct, keep the unchanged body and silhouette. Draw a correct guide for anything new or moved, and say what belongs there. A blurred or smeared old shape keeps its outline, and the model draws it back as a smudge or ghost.
- Say exactly what changes and that everything else stays the same; list the things most likely to drift (a nearby animal's pose, the car, the horizon).
- For a section redraw, tell the model the crop is an enlarged, soft piece of a larger photograph to recreate as a sharp, high-resolution real photo, keeping every element's position, size, pose, colour and light, adding and removing nothing; then add that section's subject details and references.
- When a pose or look comes from one photo and the colouring from another, say which image supplies which.
- For a detail that keeps coming out wrong (a light unit, an emblem, a posture), one close-up photo of exactly that part beats more wording.
- Reflections follow the scene: a surface facing the camera reflects what is behind the camera, and anything reflected appears mirrored. Check generated reflections for both before accepting them, and keep water reflections on the water, never painted over solid things floating in it.
