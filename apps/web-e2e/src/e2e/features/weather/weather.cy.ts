/// <reference types="cypress" />

describe('weather.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should show the weather icon', () => {
    cy.getBySel('weather--popover--trigger-button').should('exist');
  });

  it('should open the popover once you click on the trigger button', () => {
    // Make sure it does NOT exist initially
    cy.getBySel('weather--popover').should('not.exist');

    // Open the weather popover
    cy.getBySel('weather--popover--trigger-button').click();

    // After the click it should now exist in the DOM
    cy.getBySel('weather--popover').should('exist');
  });

  it('should hide if we click outside the popover', () => {
    cy.getBySel('weather--popover').should('not.exist');

    cy.getBySel('weather--popover--trigger-button').click();

    cy.getBySel('weather--popover').should('exist');

    cy.clickOutside();

    // Make sure it does not exist anymore
    cy.getBySel('weather--popover').should('not.exist');
  });

  it('should not be visible if we disable it in the settings', () => {
    cy.getBySel('weather--popover--trigger-button').should('exist');

    cy.toggleSettingsSwitch('Weather', { weatherEnabled: false });

    cy.getBySel('weather--popover--trigger-button').should('not.exist');
  });

  it.skip('should by default show the metric system', () => {
    cy.getBySel('weather--popover--trigger-button').click();

    cy.getBySel('weather--body--information--temperature').contains('°C');
    cy.getBySel('weather--body--information--windSpeed').contains('km/h');
  });

  it.skip('should correctly switch to the imperial system once settings change', () => {
    cy.toggleSettingsSwitch('Weather', { weatherUseMetricUnits: false });

    cy.getBySel('weather--popover--trigger-button').click();

    cy.getBySel('weather--body--information--temperature').contains('°F');
    cy.getBySel('weather--body--information--windSpeed').contains('mph');
  });
});
