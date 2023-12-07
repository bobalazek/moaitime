export function openTasksPopover() {
  cy.getBySel('tasks--popover').should('not.exist');

  cy.getBySel('tasks--popover--trigger-button').click();

  cy.getBySel('tasks--popover').should('exist');
}

export function openTasksFirstListActions() {
  cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

  cy.getBySel('tasks--list-actions--dropdown-menu--trigger-button').first().click();

  cy.getBySel('tasks--list-actions--dropdown-menu').should('exist');
}

export function openTasksNewListDropdownMenu() {
  cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

  cy.getBySel('tasks--selected-list--dropdown-menu--add-new-button').click();
}

export function addMultipleTasks() {
  cy.getBySel('tasks--tasks-form').find('input').type('ccc{enter}');

  // TODO: rather capture the request and wait until it's done
  cy.wait(1000);

  cy.getBySel('tasks--tasks-form').find('input').type('aaa{enter}');

  cy.wait(1000);

  cy.getBySel('tasks--tasks-form').find('input').type('ddd{enter}');

  cy.wait(1000);

  cy.getBySel('tasks--tasks-form').find('input').type('bbb{enter}');

  cy.wait(1000);
}
