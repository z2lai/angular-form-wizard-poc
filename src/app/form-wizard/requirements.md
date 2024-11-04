# Create Form Wizard design (e.g. Form Projection, validation) with reusable form groups (wizard steps) and state management (form builder service)
1. Form wizard stepper and Form projection with transclusion and DI - to understand how Material Stepper would do it so that we can integrate forms projection into the wizard/stepper
2. Reusable form groups with DI - need to apply this design pattern across all subforms
3. Scalable form state management with Facade services to be used with question node form builder design and make refactoring to NGRX easier for example