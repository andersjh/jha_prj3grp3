# import necessary libraries
# from models import create_classes
import os
import sqlalchemy
import data_info
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, join, outerjoin, MetaData, Table
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
# from connection import connect_string

   
    
@app.route("/")
def test():
    return render_template("index.html")

@app.route("/api/spi")
def spi():
    results = data_info.get_spi()
    return jsonify(results)

@app.route("/api/paleo")
def paleo():
    p_results = data_info.get_paleo()
    return jsonify(p_results)

@app.route("/api/acres_cause")
def acres_cause():
    AC_results = data_info.get_acres_cause()
    return jsonify(AC_results)

@app.route("/api/acres_class")
def acres_class():
    Aclass_results = data_info.get_acres_class()
    return jsonify(Aclass_results)

@app.route("/api/acres_year")
def acres_year():
    AY_results = data_info.get_acres_year()
    return jsonify(AY_results)

@app.route("/api/texas_fires")
def texas_fires():
    TF_results = data_info.get_texas_fires()
    return jsonify(TF_results)

# new route that keeps you from reloading the whole table 
# every time
@app.route("/api/texas_fires/<option>")
def selected_texas_fires(option):
    TF_results = data_info.get_selected_texas_fires(option)
    return jsonify(TF_results)

@app.route("/api/years")
def years():
    year_results = data_info.get_years()
    return jsonify(year_results)

# new api
@app.route("/api/causes")
def get_causes():
    cause_list = data_info.get_causes()
    return jsonify(cause_list)

if __name__ == "__main__":
    app.run(debug=True)