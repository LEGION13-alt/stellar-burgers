import order from '../fixtures/order.json';

describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', 'api/auth/login', {
      fixture: 'user.json'
    }).as('login');

    cy.intercept('POST', 'api/orders', {
      fixture: 'order.json'
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
    //  данные ификстуры
    cy.fixture('ingredients.json').then((ingredientsData: any) => {
      const buns = ingredientsData.data.filter(
        (ing: any) => ing.type === 'bun'
      );
      const mains = ingredientsData.data.filter(
        (ing: any) => ing.type === 'main'
      );
      const sauces = ingredientsData.data.filter(
        (ing: any) => ing.type === 'sauce'
      );

      const firstBun = buns[0];
      const firstMain = mains[0];
      const firstSauce = sauces[0];

      // конструктор пуст
      cy.get('[data-cy="constructor-bun"]').should('not.exist');
      cy.get('[data-cy="constructor-ingredient"]').should('have.length', 0);

      // добавляем ингредиенты
      cy.get('[data-cy="ingredient-bun"]').first().children('button').click();
      cy.get('[data-cy="ingredient-main"]').first().children('button').click();
      cy.get('[data-cy="ingredient-sauce"]').first().children('button').click();

      // проверяем наличие и содержимое
      cy.get('[data-cy="constructor-bun"]')
        .should('exist')
        .and('contain', firstBun.name);

      cy.get('[data-cy="constructor-ingredient"]')
        .should('have.length', 2)
        .first()
        .should('contain', firstMain.name);

      cy.get('[data-cy="constructor-ingredient"]')
        .last()
        .should('contain', firstSauce.name);
    });
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

  it('Закрытие модального окна ингредиента по крестику', () => {
    // данные из фикстуры
    cy.fixture('ingredients.json').then((ingredientsData: any) => {
      const firstBun = ingredientsData.data.find(
        (ing: any) => ing.type === 'bun'
      );

      cy.get('[data-cy="ingredient-bun"]').first().click();

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-title"]').should('contain', 'Детали ингредиента');

      // проверка данных ингредиента в модальном окне
      cy.get('[data-cy="modal"]').should('contain', firstBun.name);
    });

    // закрытие по крестику
    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('Закрытие модального окна ингредиента по оверлею', () => {
    cy.fixture('ingredients.json').then((ingredientsData: any) => {
      const firstSauce = ingredientsData.data.find(
        (ing: any) => ing.type === 'sauce'
      );

      cy.get('[data-cy="ingredient-sauce"]').first().click();

      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-title"]').should('contain', 'Детали ингредиента');

      cy.get('[data-cy="modal"]').should('contain', firstSauce.name);
    });

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
