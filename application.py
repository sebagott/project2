import os

from flask import Flask, session, render_template, redirect, request, url_for, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
#socketio = SocketIO(app)

names = set()
chs = {"general": [], "programming": [], "sports": [] }


@app.route("/")
def index():	
	return render_template("index.html")


@app.route("/register", methods=["POST"])
def register():		
	if request.method == "POST":		
		username = request.form.get("username")
		if username in names:			
			return jsonify({"success": False})				
		names.add(username)
		return jsonify({"success": True})
	return "Invalid request", 403

@app.route("/logout", methods=["POST"])
def logout():		
	if request.method == "POST":		
		username = request.form.get("username")							
		if username in names:					
			names.remove(username)			
			return jsonify({"success": True})										
		return jsonify({"success": False})
	return "Invalid request", 403


@app.route("/channels", methods=["GET"])
def channels():		
	if request.method == "GET":
		channels_L = []
		for c in chs.keys():
			channels_L.append(c)
		return jsonify({"channels": channels_L})
	return "Invalid request", 403

@app.route("/createchannel", methods=["POST"])
def createChannel():		
	if request.method == "POST":		
		channelname = request.form.get("channelname")
		if channelname in chs.keys():			
			return jsonify({"success": False})				
		chs[channelname] = []
		return jsonify({"success": True})
	return "Invalid request", 403