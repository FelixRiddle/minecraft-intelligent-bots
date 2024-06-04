import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

import mysqlConn from "./connection/mysqlConn";

/**
 * Models
 * 
 * This class is to use the same connection to use models
 * Something that I haven't been doing, because I just didn't know.
 */
export default class Models {
    connection = undefined;
    
    /**
     * Constructor
     */
    constructor() {
        this.connection = mysqlConn();
        
        this.Commander = this.#commander();
    }
    
    /**
     * Commander
     */
    #commander() {
        const model = this.connection.define("commander", {
            id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        });
        
        return model;
    }
}
