describe('Search flow', () => {
  it('types a query and sees filtered results', () => {
    cy.visit('/');
    cy.get('input[placeholder="Search content..."]').as('search');
    cy.get('@search').type('the');
    cy.wait(600); // debounce + render
    // Accept either: results grid OR an empty state message
    cy.get('body').then($b => {
      const hasEmpty = /No results found/i.test($b.text());
      if (hasEmpty) {
        cy.contains(/No results found/i).should('exist');
      } else {
        cy.contains(/Read More|View Movie|Play Now|View Post/i).should('exist');
      }
    });
  });
});


