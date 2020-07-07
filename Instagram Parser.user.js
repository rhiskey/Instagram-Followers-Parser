// ==UserScript==
// @name         Instagram Parser
// @namespace    http://insta-give.herokuapp.com/
// @version      0.1
// @description  Parsing Followers for instagram
// @author       rhiskey
// @match        https://www.instagram.com/
// @grant        none
// @license CC-BY-SA-3.0; http://creativecommons.org/licenses/by-sa/3.0/
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    function doc_keyUp(e) {
        switch (e.keyCode) {
            case 40:
                //Стрелка вниз
                try {
                    // ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ
                    var div_accounts = document.getElementsByClassName("isgrP"); // класс тега div списка аккаунтов
                    var ul_accounts = document.getElementsByClassName("jSC57  _6xe7A"); // класс тега ul списка аккаунтов
					// класс тега li списка тег аккаунтов
                    var li_accounts = document.getElementsByClassName("PZuss");
                    var height_scrolling = []; // массив размеров (высот) скроллинга
                    // ----------------------------------------------------------------------------------
                    // СКОРОСТЬ ПРОКРУТКИ
                    // Задаётся в миллисекундах
                    // ----------------------------------------------------------------------------------
                    var speed_scrolling = 250;
                    // ----------------------------------------------------------------------------------
                    // УКАЖИТЕ ТРЕБУЕМОЕ КОЛ-ВО АККАУНТОВ ДЛЯ СБОРА
                    // Если указать 0 (ноль) - соберет все аккаунты, по умолчанию стоит 700, свыше возможны
                    // ограничения - лимиты самого Instagram (ошибка 429)
                    // ----------------------------------------------------------------------------------
                    var user_count = 700;
                    // ----------------------------------------------------------------------------------
                    // ДЛЯ СБОРА ИМЕН АККАУНТОВ УКАЖИТЕ true ВМЕСТО false
                    // ----------------------------------------------------------------------------------
                    var user_name = false; // true
                    // ----------------------------------------------------------------------------------
                    // Выборка кол-ва подписчиков и подписок по языку RU-EN
                    // Классы расположены на главной странице Подписчики-Подписки
                    // ----------------------------------------------------------------------------------
                    var titleH1 = document.getElementsByClassName("m82CD")[0]; // класс тега h1 заголовка окна
                    //var titleDIV = titleH1.getElementsByTagName("div")[0]; // тег div заголовка
                    var title = titleH1.innerHTML;
                    // ----------------------------------------------------------------------------------
                    // УСЛОВИЕ ВЫБОРА ПОДПИСЧИКИ ИЛИ ПОДПИСКИ
                    // ----------------------------------------------------------------------------------
                    if (title == "Подписчики" || title == "Followers") {
                        var total_count = document.getElementsByClassName("Y8-fY")[1].innerHTML;
                    } else {
                        total_count = document.getElementsByClassName("Y8-fY")[2].innerHTML;
                    }
                    // ----------------------------------------------------------------------------------
                    // Общее кол-во аккаунтов для сбора
                    // ----------------------------------------------------------------------------------
                    total_count = total_count.match(/[^"]+/g).join('').match(/[^\s]+/g).join('').match(/[^,]+/g).join('');
                    // ----------------------------------------------------------------------------------
                    console.log('%cОбщее кол-во аккаунтов для сбора: ' + total_count + ' шт.', 'color: #13a555; font-size:16px;');
                    // ----------------------------------------------------------------------------------
                    if (user_count != 0) {
                        console.log('%cКол-во заданное пользователем: ' + user_count + ' шт.', 'color: #13a555; font-size:16px;');
                    }
                    // ----------------------------------------------------------------------------------
                    console.log('%cНачался сбор данных, дождитесь выполнения...', 'color: #13a555; font-size:16px;');
                    // ----------------------------------------------------------------------------------
                    // ФУНКЦИЯ СБОРА ДАННЫХ
                    // ----------------------------------------------------------------------------------
                    function start_parsing() {
                        var accounts = ul_accounts[0].innerHTML;
                        // ------------------------------------------------------------------------------
                        // Разбор ников аккаунтов
                        // ------------------------------------------------------------------------------
                        var result_nick = accounts.match(/title="[^"]+"/g);
                        result_nick.splice(user_count);
                        var result_count = result_nick.length;
                        if (result_nick!='Подтвержденный'){
                            result_nick = result_nick.join(' ').match(/"[^"]+"/g).join(' ').match(/[^"]+/g).join('').match(/[^\s]+/g).join('\n');
                        }
                        // ------------------------------------------------------------------------------
                        // Разбор имен аккаунтов
                        // ------------------------------------------------------------------------------
                        if (user_name == true) {
                            var result_name = accounts.match(/<div class="wFPL8 ">[^<]+/g)
                            result_name.splice(user_count);
                            result_nick = result_nick.match(/[^\n]+/g);
                            result_name = result_name.join('').match(/>[^<]+/g).join('').match(/[^>]+/g).join('\n');

                            result_name = result_name.match(/[^\n]+/g);
                            // --------------------------------------------------------------------------
                            // Создаем ассоциативный массив и преобразовываем в строку
                            // --------------------------------------------------------------------------
                            var result_nick_name = {};
                            for (var i = 0; i < result_nick.length; i++) {
                                result_nick_name[result_nick[i]] = result_name[i];
                            }
                            result_nick_name = JSON.stringify(result_nick_name);
                            result_nick_name = result_nick_name.match(/[^{}"]+/g).join('').match(/[^,]+/g).join('\n').match(/[^:]+/g).join(' : ');
                        }
                        if (user_name == true) {
                            console.log(result_nick_name);
                        } else {
                            console.log(result_nick);
                        }
                        console.log('%cАккаунтов собрано: ' + result_count + ' шт.', 'color: #13a555; font-size:18px;');
                        console.log('%cВыделите собранные имена аккаунтов выше и нажмите CTRL-C, чтобы скопировать.', 'color: #13a555; font-size:16px;');

                    }
                    // ----------------------------------------------------------------------------------
                    // ФУНКЦИЯ СКРОЛЛИНГА
                    // ----------------------------------------------------------------------------------
                    function run_scrolling() {
                        // Определяем размер (высоту) прокрутки div_accounts
                        var div_accounts_height = div_accounts[0].scrollHeight;
                        // Заносим размеры в массив
                        height_scrolling.push(div_accounts_height);
                        // Если пользовательское значение больше реального или установлен 0, то собрать все аккаунты
                        if (user_count >= total_count || user_count == 0) {
                            user_count = total_count;
                        }
                        if ((li_accounts.length != total_count) && (user_count > li_accounts.length) && (height_scrolling[0] != height_scrolling[4])) {
                            div_accounts[0].scrollBy(0, 500);
                            //  Если в массиве размеров скроллинга более 5 элементов, обнуляем
                            if (height_scrolling.length == 5) {
                                height_scrolling = [];
                            }
						var timeoutID = setTimeout(run_scrolling, speed_scrolling);
                        } else {
                            clearTimeout(timeoutID);
                            start_parsing();
                        }
                        return false;
                    }
                    // ----------------------------------------------------------------------------------
                    // СТАРТ РАБОТЫ СКРОЛЛИНГА + СБОР ДАННЫХ
                    // ----------------------------------------------------------------------------------
                    run_scrolling();
                    // ----------------------------------------------------------------------------------
                } catch (e) {
                    console.log('%cНажмите на странице Instagram на Подписчиков или Подписки, и запустите заново скрипт', 'color: #a22e1c; font-size:18px;');
                }
                // ---------------------------------------------------------------------------------
                // АВТОР КОДА: Леонид Залюбовский 2019 | http://www.leoneed.pro | http://Instagram.com/leoneed.pro
                // Я ЛИШЬ ИСПРАВИЛ РАБОТОСПОСОБНОСТЬ, обновил старые пути и добавил TAMPERMONKEY. Искренне ВАШ rhiskey
                // ---------------------------------------------------------------------------------
                break;

            case 83:
                //s

                break;
            case 68:
                //d

                break;
            case 70:
                //f

                break;
            default:
                break;
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);


})();