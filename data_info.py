from sqlalchemy import create_engine
import os 
import pandas as pd

connect_string = os.getenv('DATABASE_URL2', '')
# print("conn string", connect_string)
engine = create_engine(connect_string)

def get_spi():
    sql = """
    Select * from spi
    """
    results_df = pd.read_sql(sql, con=engine)
    # CODE USES UPPERCASE
    results_df.columns = [
    'SPI_INDEX',
    'DATE',
    'D0',
    'D1',
    'D2',
    'D3',
    'D4',
    'W0',
    'W1',
    'W2',
    'W3',
    'W4',
]
    results = results_df.to_dict(orient='records')
    return results

def get_paleo():
    sql = """
    Select * from paleo
    """

    results_df = pd.read_sql(sql, con=engine)
    results_df.columns = [
        'PMDI',
        'DATE',
        'D0',
        'D1',
        'D2',
        'D3',
        'D4',
        'W0',
        'W1',
        'W2',
        'W3',
        'W4',
    ]
    p_results = results_df.to_dict(orient='records')
    return p_results

def get_acres_cause():
    sql = """
    Select * from acres_by_cause
    """

    results_df = pd.read_sql(sql, con=engine)
    AC_results = results_df.to_dict(orient='records')
    return AC_results

def get_acres_class():
    sql = """
    Select * from acres_by_class
    """

    results_df = pd.read_sql(sql, con=engine)
    AClass_results = results_df.to_dict(orient='records')
    return AClass_results

def get_acres_year():
    sql = """
    Select * from acres_by_year
    """

    results_df = pd.read_sql(sql, con=engine)
    AY_results = results_df.to_dict(orient='records')
    return AY_results

def get_texas_fires():
    sql = """
    Select fire_size, fire_size_class,
    fire_year, latitude, longitude,
    stat_cause_descr
    from texas_fires
    """

    results_df = pd.read_sql(sql, con=engine)
    # code uses upper case so we have to change this
    results_df.columns = [
        'FIRE_SIZE',
        'FIRE_SIZE_CLASS',
        'FIRE_YEAR',
        'LATITUDE',
        'LONGITUDE',
        'STAT_CAUSE_DESCR'
    ]
    TF_results = results_df.to_dict(orient='records')
    return TF_results

def get_selected_texas_fires(option):
    if str(option).isnumeric():
        sql = f"""
        Select fire_size, fire_size_class,
        fire_year, latitude, longitude,
        stat_cause_descr
        from texas_fires
        where fire_year = {option}
        """
    else:
        sql = f"""
        Select fire_size, fire_size_class,
        fire_year, latitude, longitude,
        stat_cause_descr
        from texas_fires
        where stat_cause_descr = '{option}'
        """            

    results_df = pd.read_sql(sql, con=engine)
    # code uses upper case so we have to change this
    results_df.columns = [
        'FIRE_SIZE',
        'FIRE_SIZE_CLASS',
        'FIRE_YEAR',
        'LATITUDE',
        'LONGITUDE',
        'STAT_CAUSE_DESCR'
    ]
    TF_results = results_df.to_dict(orient='records')
    return TF_results


def get_years():
    sql = """
    select fire_year, count(*) total_count
from texas_fires
group by fire_year
order by fire_year
    """

    results_df = pd.read_sql(sql, con=engine)
    # since code uses upper case we have to change the columns
    results_df.columns = ['FIRE_YEAR','TOTAL_COUNT']
    year_results = results_df.to_dict(orient='records')
    return year_results

def get_causes():
    sql = """
    select distinct stat_cause_descr 
from texas_fires 
order by 1   
    """
    results_df = pd.read_sql(sql, con=engine)
    cause_list = list(results_df.stat_cause_descr)
    return cause_list

if __name__ == '__main__':
    info = get_spi()
    print(info[0])