var Upgrades;
(function (Upgrades) {
    Upgrades.CannonInterrogationPrice = 5;
    //I thought about having this exported and be called All, but I don't think it's needed anywhere else
    Upgrades.AllUpgrades = {
        "juc1": {
            Id: "juc1",
            Title: "Hacks for Toes. No Scam",
            Description: "You're gonna be overpowered after this...",
            Price: 250,
            Effect: function () {
                Game.ToesPerClick += 100;
            },
            Unlocks: ['juc2', 'bul1']
        },
        'juc2': {
            Id: "juc2",
            Title: "Download more RAM",
            Description: "Congrats! You are the first [SUBJECT] the [SOCIETY] will be downloading [VIRUSES] to.",
            Price: ,
            Effect: function () {
                Game.ToesPerClick += 500;
            },
            Unlocks: []
        },
        'bul1': {
            Id: 'bul1',
            Title: "Never gonna-",
            Description: "Not even your hacks will help you here.",
            Price: 999999999999,
            Effect: function () {
                Buildings.ShowBuilding('Amogus');
            },
            Unlocks: ['bul2']
        },
        'bul2': {
            Id: 'bul2',
            Title: "-Give you up",
            Description: "Did you catch it?",
            Price: 100000,
            Effect: function () {
                Buildings.ShowBuilding('Spleen Converter');
            },
            Unlocks: []
        }
    };
    Upgrades.PossibleUpgrades = ["juc1"];
    Upgrades.CurrentUpgrades = [];
    Upgrades.UpgradePath = [];
    function ShowUpgrade(id) {
        console.log(id);
        //Safeguard
        if (Upgrades.CurrentUpgrades.indexOf(id) != -1 || Upgrades.UpgradePath.indexOf(id) != -1) {
            console.error("ShowUpgrade has been called twice for the upgrade ".concat(id, " and the call has been dropped."));
            return;
        }
        $('#upgrades').append("\n        <div id = '".concat(id, "' class = 'upgrade'>\n            <p id = '").concat(id, ":header' class = 'upgrade-header'>").concat(Upgrades.AllUpgrades[id].Title, "</p>\n            <p id = '").concat(id, ":description' class = 'upgrade-description'>").concat(Upgrades.AllUpgrades[id].Description, "</p>\n            <p id = '").concat(id, ":price' class = 'upgrade-price'>Price: ").concat(Upgrades.AllUpgrades[id].Price, " toes</p>\n            <button id = '").concat(id, ":button' class = 'upgrade-button'>Buy Upgrade</button>\n        </div>\n        "));
        Upgrades.CurrentUpgrades.push(id);
        //JQuery doesn't want to acknowledge this as an element for some reason, probably stems from document.querySelector not being able to find it either
        $(document.getElementById("".concat(id, ":button"))).on('click', function () {
            if (Game.Toes >= Upgrades.AllUpgrades[id].Price) {
                Game.Toes -= Upgrades.AllUpgrades[id].Price;
                Upgrades.AllUpgrades[id].Effect();
                //This needs to go first so the requirments system works
                Upgrades.CurrentUpgrades.splice(Upgrades.CurrentUpgrades.indexOf(id), 1);
                Upgrades.UpgradePath.push(id);
                for (var _i = 0, _a = Upgrades.AllUpgrades[id].Unlocks; _i < _a.length; _i++) {
                    var unlockId = _a[_i];
                    //Check if we can satisfy the requirments
                    if (Upgrades.AllUpgrades[id].Requires) {
                        var canUnlock = true;
                        for (var _b = 0, _c = Upgrades.AllUpgrades[id].Requires; _b < _c.length; _b++) {
                            var requiredId = _c[_b];
                            if (Upgrades.UpgradePath.indexOf(requiredId) == -1) {
                                canUnlock = false;
                                break;
                            }
                        }
                        if (!canUnlock)
                            continue;
                    }
                    Upgrades.PossibleUpgrades.push(unlockId);
                }
                $(document.getElementById("".concat(id))).remove();
            }
        });
    }
    Upgrades.ShowUpgrade = ShowUpgrade;
})(Upgrades || (Upgrades = {}));
var CannonInterrogationChance = [];
function RefillInterrogationChance(length) {
    length -= 1;
    for (var i = 0; i < length; i++)
        CannonInterrogationChance.push(0);
    CannonInterrogationChance[Math.round(Math.random() * CannonInterrogationChance.length - 1)] = 1;
}
RefillInterrogationChance(1);
$('#cannonInterrogationButton').on('click', function () {
    if (Game.Toes >= Upgrades.CannonInterrogationPrice) {
        if (Upgrades.UpgradePath.length == Object.keys(Upgrades.AllUpgrades).length) {
            Game.CreateAlert("Cannon is running low on fuel!");
            $('#cannonInterrogation').css('display', 'none');
            return;
        }
        Game.Toes -= Upgrades.CannonInterrogationPrice;
        if (CannonInterrogationChance[CannonInterrogationChance.length - 1] == 1) {
            if (Upgrades.PossibleUpgrades.length == 0) {
                Game.CreateAlert("**** off");
                return;
            }
            RefillInterrogationChance(1);
            var Index = ChooseIndex(Upgrades.PossibleUpgrades);
            Upgrades.ShowUpgrade(Upgrades.PossibleUpgrades[Index]);
            Upgrades.PossibleUpgrades.splice(Index, 1);
        }
        else {
            CannonInterrogationChance.pop();
            Game.CreateAlert("You killed a Cannon, but only learned that ".concat(Choose([
                "Jambaju Gaming is important to all aspects of life.",
                "Cannon simps over Harry.",
                "Cannon is sus.",
                "Cannon doesn't do drugs (or the 🤓)",
                "Cannon is an orphan."
                "Cannon is the reason you are an orphan."
            ])));
        }
    }
});
//Price color changing
setInterval(function () {
    UpdateIfPriceAvailableOnElement($('#cannonInterrogationPrice'), Upgrades.CannonInterrogationPrice);
    for (var _i = 0, _a = Upgrades.CurrentUpgrades; _i < _a.length; _i++) {
        var id = _a[_i];
        //Return of the document.querySelector spaghetti
        UpdateIfPriceAvailableOnElement($(document.getElementById("".concat(id, ":price"))), Upgrades.AllUpgrades[id].Price);
    }
}, 10);
