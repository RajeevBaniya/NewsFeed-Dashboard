describe('Drag and drop', () => {
  it('switches to draggable view and shows Save button state', () => {
    cy.visit('/');
    // Toggle to draggable mode via ViewToggle (label shows 'View:' and mode text updates)
    cy.contains('span', 'View:').parent().within(() => {
      cy.get('button').click({ force: true });
      cy.contains('span', 'Draggable').should('exist');
    });
    // Save button should exist and initially be disabled
    cy.contains('button', 'No Changes').should('exist');
  });
});


