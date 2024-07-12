### Objective

Objective is to determine an alternative approach (already designed by UX team) to multi-page modals that solves the modal pain points while having good usability (UX) and technical feasibility with regards to form state vs UI state management. For example:

1. **Form State Management**: By default, all form values and validations are updated/triggered on initial form model creation and again on subsequent form model modifications with addControl, push, etc.
2. **UI State Management**: We can use the combination of form valid status and touched status to decide whether or not to show the error in the UI. However, if you need more variation or customization to the form UX such as separating the eligibility check (async backend validations) from the sync frontend validations for example, you'd need to add additional UI state variables to manage these two different UI states.

### POC Description

Long-form approach for a multi-item multi-step form as opposed to the multi-page approach (in a modal):

1. The parent form is a dynamic form array containing sub forms of different types that can be edited and validated at anytime.
2. Each sub form has both async validations and sync validations.
3. Parent form has to track overall validity to manage form submission (Continue button). Users should still be able to click on the Continue button to get feedback about the errors in the form, or submit the form.
