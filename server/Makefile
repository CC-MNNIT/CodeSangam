# Set the name of the binary to be built
BINARY_NAME := codesangam-backend

# Set the Go compiler to use
GO := go

# Set the flags to pass to the Go compiler
GOFLAGS :=

# Set the directory where the source code is located
SRC_DIR := .

# Set the directory where the binary will be built
BUILD_DIR := ./bin

# Set the name of the test binary to be built
TEST_BINARY_NAME := $(BINARY_NAME)_test

# Set the directory where the test binary will be built
TEST_BUILD_DIR := ./test

# Make Swagger
swagger:
	@swag init $(SRC_DIR)

# Build the binary
build: swagger
	@$(GO) build $(GOFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) $(SRC_DIR)

# Run the binary
run-build: build
	@$(BUILD_DIR)/$(BINARY_NAME)

# Run the binary
run: swagger
	@$(GO) run $(GOFLAGS) $(SRC_DIR)/main.go

# Build the test binary
test-build:
	@$(GO) test $(GOFLAGS) -c -o $(TEST_BUILD_DIR)/$(TEST_BINARY_NAME) $(SRC_DIR)

# Run the tests
test: test-build
	@$(TEST_BUILD_DIR)/$(TEST_BINARY_NAME)
