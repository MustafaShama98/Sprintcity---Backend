const getConnection=require("../../../../DataBase/getDataBaseConnection")
async function getAccountingLastThreeMonthe() {
    try {
        var connection=await getConnection()
        const query = {
        text:`SELECT *
        FROM accounting
        WHERE date >= CURRENT_DATE - INTERVAL '2 months'
        ORDER BY date desc
        ` ,
        values: [],
      }
      var shipments = await connection.query(query);
    } catch (error) {
      console.error('Error executing a query:', error);
      return {status:400,data:'אירעה שגיאה'};

    } finally {
      connection.release();
    }
      return {status:200,data:shipments.rows};
}
async function getAllAccounting() {
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *,to_char(date, 'DD/MM/YYYY') AS date_
      FROM accounting
      ORDER BY date_ desc
      ` ,
      values: [],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}
async function getAccountingLastYear() {
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *
      FROM accounting
      WHERE date >= CURRENT_DATE - INTERVAL '12 months'
      ORDER BY date desc
      ` ,
      values: [],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}

async function getAccountingLastYearByEmail(email) {
 
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *
      FROM accounting
      WHERE date >= CURRENT_DATE - INTERVAL '12 months' AND email=$1
      ORDER BY date desc
      ` ,
      values: [email],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}
async function getAccountingLastThreeMontheByEmail(email) {
 
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *
      FROM accounting
      WHERE date >= CURRENT_DATE - INTERVAL '2 months' AND email=$1
      ORDER BY date desc
      ` ,
      values: [email],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}
async function getAllAccountingByEmail(email) {
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *,to_char(date, 'DD/MM/YYYY') AS date_
      FROM accounting
      WHERE email=$1
      ORDER BY date_ desc
      ` ,
      values: [email],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}












async function getAccountingSpecificDate(from,to) {
  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *
      FROM accounting    
      WHERE 
          EXTRACT(MONTH FROM date) >= EXTRACT(MONTH FROM $1::date)
          AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM $1::date)
          AND EXTRACT(MONTH FROM date) <= EXTRACT(MONTH FROM $2::date)
          AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM $2::date);
      ORDER BY date desc
      ` ,
      values: [from,to],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}
async function getAccountingSpecificDateByEmail(email,from,to) {

  try {
      var connection=await getConnection()
      const query = {
      text:`SELECT *
      FROM accounting    
      WHERE email=$3
          AND EXTRACT(MONTH FROM date) >= EXTRACT(MONTH FROM $1::date)
          AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM $1::date)
          AND EXTRACT(MONTH FROM date) <= EXTRACT(MONTH FROM $2::date)
          AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM $2::date);
      ORDER BY date desc
      ORDER BY date desc
      ` ,
      values: [from,to,email],
    }
    var shipments = await connection.query(query);
  } catch (error) {
    console.error('Error executing a query:', error);
    return {status:400,data:'אירעה שגיאה'};

  } finally {
    connection.release();
  }
    return {status:200,data:shipments.rows};
}
module.exports = {getAllAccountingByEmail,getAccountingLastYearByEmail,getAccountingLastYear,getAllAccounting,getAccountingLastThreeMonthe,getAccountingLastThreeMontheByEmail,getAccountingSpecificDateByEmail,getAccountingSpecificDate};
