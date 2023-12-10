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
  const addAndWaitForTask = (taskName: string) => {
    const aliasName = `createTask-${taskName}`;

    cy.intercept('POST', '/api/v1/tasks').as(aliasName);

    cy.getBySel('tasks--tasks-form').find('input').type(`${taskName}{enter}`);

    cy.wait(`@${aliasName}`);

    cy.getBySel('tasks--tasks-list')
      .find('[data-test="tasks--task"]')
      .last()
      .find('[data-test="tasks--task--name"]')
      .should('have.text', taskName);
  };

  addAndWaitForTask('ccc');
  addAndWaitForTask('aaa');
  addAndWaitForTask('ddd');
  addAndWaitForTask('bbb');
}
