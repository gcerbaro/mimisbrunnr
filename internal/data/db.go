// data/database.go
package data

import (
    "log"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() error {
    var err error
    DB, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
    if err != nil {
        return err
    }
    
    log.Println("Database initialized successfully")
    return nil
}

func GetDB() *gorm.DB {
    return DB
}

func CloseDB() error {
    sqlDB, err := DB.DB()
    if err != nil {
        return err
    }
    return sqlDB.Close()
}