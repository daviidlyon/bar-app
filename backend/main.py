from flask import Flask, request, jsonify
from flask_restful import Api, Resource

import json

from flask_cors import CORS, cross_origin

from mock_data import FRIENDS_LIST, MENU, MENU_PRICE_MAP

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

api = Api(app)


def read_file(filename):
    try:
        with open(filename, "r") as file:
            return json.load(file)
    except Exception as e:
        print(
            f"Error: An unexpected error occurred while reading file '{filename}': {e}"
        )
        return []


def update_accounts(existing_accounts, new_order):
    accounts = existing_accounts
    for account in accounts:
        if account["owner"] == new_order["owner"]:
            for item, quantity in new_order["items"].items():
                account["items"][item] = account["items"].get(item, 0) + quantity
            break
    else:
        accounts.append(new_order)

    return accounts


def find_account_by_owner(accounts, owner):
    for account in accounts:
        if "owner" in account and account["owner"] == owner:
            return account
    return None  # Return None if the account is not found


@app.route("/menu")
def get_menu():
    return jsonify(MENU), 200


@app.route("/friends")
def get_friends():
    return jsonify(FRIENDS_LIST), 200


@app.route("/create-order", methods=["POST"])
def create_order():
    try:
        new_order = request.json
        existing_accounts = read_file("in-memory-data.json")
        saved_data = update_accounts(existing_accounts, new_order)
        json_data = json.dumps(saved_data, indent=4)

        # Write JSON string to a file
        with open("in-memory-data.json", "w") as json_file:
            json_file.write(json_data)

        return jsonify({"message": "Order created successfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred : {e}"}), 500


@app.route("/get-account/<string:owner>")
def get_account(owner):
    try:
        existing_accounts = read_file("in-memory-data.json")
        account = find_account_by_owner(existing_accounts, owner)

        if not account:
            return jsonify({"error": "Owner's account not found"}), 404

        total = 0
        for item, quantity in account["items"].items():
            sub_total = MENU_PRICE_MAP[item] * quantity
            total += sub_total

        account["total"] = total

        return jsonify(account), 200
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred : {e}"}), 500


@app.route("/pay-account/<string:owner>", methods=["DELETE"])
def pay_account(owner):
    try:
        existing_accounts = read_file("in-memory-data.json")

        for account in existing_accounts:
            if "owner" in account and account["owner"] == owner:
                existing_accounts.remove(account)
                break
        else:
            return jsonify({"error": "Owner's account not found"}), 404

        json_data = json.dumps(existing_accounts, indent=4)

        with open("in-memory-data.json", "w") as json_file:
            json_file.write(json_data)

        return jsonify({"message": "Account paid succesfully"}), 200
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred : {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=8000)
