
const { test } = require("node:test");
const assert = require("node:assert");

test("Проверка работы API", async () => {
    const response = await fetch("http://localhost:3001/api/health");

    assert.equal(response.status, 200);
});

test("Жизненный цикл заявки", async () => {

    // 1. Создаём заявку
    const response1 = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-name": "QA Tester",
            "x-user-role": "duty"
        },
        body: JSON.stringify({
            type: "inspection",
            equipmentId: "QA-TEST-001",
            description: "Тестовый осмотр",
            priority: "normal",
            authorName: "QA Tester",
            authorContact: "qa@example.com",
            dueAt: new Date(Date.now() + 604800000).toISOString()
        })
    });

    assert.equal(response1.status, 201);

    const created = await response1.json();
    assert.equal(created.status, "new");

    const id = created.id;
    assert.ok(id);

    // 2. Инженер принимает заявку
    const response2 = await fetch(
        "http://localhost:3001/api/requests/" + id + "/take",
        {
            method: "POST",
            headers: {
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            }
        }
    );

    assert.equal(response2.status, 200);

    const taken = await response2.json();
    assert.equal(taken.status, "in_progress");

    // 3. Закрываем заявку
    const response3 = await fetch(
        "http://localhost:3001/api/requests/" + id,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            },
            body: JSON.stringify({
                status: "done",
                closingComment: "Осмотр выполнен"
            })
        }
    );

    assert.equal(response3.status, 200);

    const closed = await response3.json();
    assert.equal(closed.status, "done");

    // 4. Повторно закрыть заявку нельзя
    const response4 = await fetch(
        "http://localhost:3001/api/requests/" + id,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            },
            body: JSON.stringify({
                status: "done",
                closingComment: "Закрываем повторно"
            })
        }
    );

    assert.equal(response4.status, 409);

});

test("Дежурный не может принять заявку", async () => {

    // Создаём новую заявку
    const response1 = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-name": "QA Tester",
            "x-user-role": "duty"
        },
        body: JSON.stringify({
            type: "inspection",
            equipmentId: "QA-TEST-001",
            description: "Проверка прав доступа",
            priority: "normal",
            authorName: "QA Tester",
            authorContact: "qa@example.com",
            dueAt: new Date(Date.now() + 604800000).toISOString()
        })
    });

    assert.equal(response1.status, 201);

    const created = await response1.json();

    // Дежурный пытается принять заявку
    const response2 = await fetch(
        "http://localhost:3001/api/requests/" + created.id + "/take",
        {
            method: "POST",
            headers: {
                "x-user-name": "QA Tester",
                "x-user-role": "duty"
            }
        }
    );

    
    // Проверяем запрет доступа
    assert.equal(response2.status, 403);

    // Получаем заявку после запрещённого действия
    const response3 = await fetch(
        "http://localhost:3001/api/requests/" + created.id,
        {
            method: "GET",
            headers: {
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            }
        }
    );

    // Проверяем, что заявка найдена
    assert.equal(response3.status, 200);

    // Получаем данные заявки
    const current = await response3.json();

    // Заявка должна остаться новой
    assert.equal(current.status, "new");

});

test("Инженер не может создать заявку", async () => {

    // Инженер пытается создать заявку
    const response = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-name": "Engineer QA",
            "x-user-role": "engineer"
        },
        body: JSON.stringify({
            type: "inspection",
            equipmentId: "QA-TEST-001",
            description: "Проверка неправильной роли",
            priority: "normal",
            authorName: "Engineer QA",
            authorContact: "qa@example.com",
            dueAt: new Date(Date.now() + 604800000).toISOString()
        })
    });

    // Ожидаем запрет доступа
    assert.equal(response.status, 403);

});

test("Нельзя создать заявку на несуществующее оборудование", async () => {

    const response = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-name": "QA Tester",
            "x-user-role": "duty"
        },
        body: JSON.stringify({
            type: "inspection",
            equipmentId: "QA-NOT-EXIST-" + Date.now(),
            description: "Проверка неправильного оборудования",
            priority: "normal",
            authorName: "QA Tester",
            authorContact: "qa@example.com",
            dueAt: new Date(Date.now() + 604800000).toISOString()
        })
    });

    // Ожидаем, что сервер отклонит запрос
    assert.ok(response.status >= 400 && response.status < 500);

});

test("Нельзя закрыть новую заявку без принятия в работу", async () => {

    // Создаём новую заявку
    const response1 = await fetch("http://localhost:3001/api/requests", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-name": "QA Tester",
            "x-user-role": "duty"
        },
        body: JSON.stringify({
            type: "inspection",
            equipmentId: "QA-TEST-001",
            description: "Проверка перехода статуса",
            priority: "normal",
            authorName: "QA Tester",
            authorContact: "qa@example.com",
            dueAt: new Date(Date.now() + 604800000).toISOString()
        })
    });

    assert.equal(response1.status, 201);

    const created = await response1.json();

    // Пытаемся сразу закрыть заявку
    const response2 = await fetch(
        "http://localhost:3001/api/requests/" + created.id,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            },
            body: JSON.stringify({
                status: "done",
                closingComment: "Попытка закрытия"
            })
        }
    );

    // Сервер должен отклонить переход
    assert.ok(response2.status >= 400 && response2.status < 500);

    // Проверяем, что статус заявки не изменился
    const response3 = await fetch(
        "http://localhost:3001/api/requests/" + created.id,
        {
            headers: {
                "x-user-name": "Engineer QA",
                "x-user-role": "engineer"
            }
        }
    );

    assert.equal(response3.status, 200);

    const current = await response3.json();
    assert.equal(current.status, "new");

});



