import ingredients from '../fixtures/ingredients.json';
import user from '../fixtures/user.json';
import order from '../fixtures/order.json';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      statusCode: 200,
      body: ingredients
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: user
    }).as('getUser');

    cy.intercept('POST', 'api/auth/login', {
      statusCode: 200,
      body: user
    }).as('login');

    cy.intercept('POST', 'api/orders', {
      statusCode: 200,
      body: order
    }).as('createOrder');

    // авторизация
    window.localStorage.setItem('refreshToken', 'fakeRefreshToken');
    cy.setCookie('accessToken', 'fakeAccessToken');

    cy.visit('http://localhost:4000/');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  afterEach(() => {
    window.localStorage.clear();
    cy.clearCookies();
  });

  it('Добавление ингредиентов в конструктор', () => {
    cy.get('[data-cy="ingredient-bun"]').first().children('button').click();
    cy.get('[data-cy="ingredient-main"]').first().children('button').click();
    cy.get('[data-cy="ingredient-sauce"]').first().children('button').click();
    cy.get('[data-cy="constructor-bun"]').should('exist');
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 2);
  });

  it('Замена булки в конструкторе', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('button').click();
      });
    cy.get('[data-cy="constructor-bun"]').should(
      'contain',
      'Краторная булка N-200i'
    );

    // заменяем булку
    cy.get('[data-cy="ingredient-bun"]')
      .eq(1)
      .within(() => {
        cy.get('button').click();
      });

    cy.get('[data-cy="constructor-bun"]').should(
      'contain',
      'Флюоресцентная булка R2-D3'
    );
  });

  it('Открытие и закрытие модального окна ингредиента по крестику', () => {
    cy.get('[data-cy="ingredient-bun"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="modal-title"]').should('contain', 'Детали ингредиента');

    // закрытие по крестику
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модального окна ингредиента по оверлею', () => {
    cy.get('[data-cy="ingredient-sauce"]').first().click();
    cy.get('[data-cy="modal"]').should('be.visible');

    // закрытие по оверлею
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Создание заказа и очистка конструктора', () => {
    cy.get('[data-cy="ingredient-bun"]')
      .first()
      .within(() => {
        cy.get('button').click();
      });
    cy.get('[data-cy="ingredient-main"]')
      .first()
      .within(() => {
        cy.get('button').click();
      });

    // проверка активности кнопки заказа
    cy.get('[data-cy="order-button"]').should('not.be.disabled');
    cy.get('[data-cy="order-button"]').click();

    cy.wait('@createOrder', { timeout: 10000 });

    cy.get('[data-cy="modal"]').should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', order.order.number);

    // закрытие модального окна
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');

    // проверка очистки конструктора
    cy.get('[data-cy="constructor-bun"]').should('not.exist');
    cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);
  });
});
