package db

// func Migrate(db *gorm.DB, migrateFuncs ...func(*gorm.DB) error) error {
// 	for _, migrateFunc := range migrateFuncs {
// 		if err := migrateFunc(db); err != nil {
// 			log.Printf("Failed to run migration: %v", err)
// 			return err
// 		}
// 	}
// 	log.Println("Database migration completed successfully")
// 	return nil
// }
