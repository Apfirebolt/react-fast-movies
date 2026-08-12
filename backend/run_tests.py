#!/usr/bin/env python3
"""
Test Runner for Fast React Movies Backend

This script provides various options for running tests with different configurations.
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# Add backend directory to Python path
backend_dir = Path(__file__).parent.parent
sys.path.append(str(backend_dir))

def run_command(command, description=""):
    """Run a command and handle output"""
    if description:
        print(f"\n🔧 {description}")
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=False)
    return result.returncode == 0

def setup_test_environment():
    """Set up test environment"""
    print("🚀 Setting up test environment...")
    
    # Set test environment variables
    os.environ["TESTING"] = "1"
    os.environ["DATABASE_URL"] = "sqlite:///./test.db"
    
    # Install test dependencies if needed
    test_requirements = [
        "pytest",
        "pytest-asyncio", 
        "pytest-cov",
        "pytest-xdist",
        "httpx"  # For async client testing
    ]
    
    for package in test_requirements:
        run_command(f"pip install {package}", f"Installing {package}")

def run_unit_tests():
    """Run unit tests only"""
    command = "pytest tests/ -m unit -v"
    return run_command(command, "Running unit tests")

def run_integration_tests():
    """Run integration tests only"""
    command = "pytest tests/ -m integration -v"
    return run_command(command, "Running integration tests")

def run_all_tests():
    """Run all tests"""
    command = "pytest tests/ -v"
    return run_command(command, "Running all tests")

def run_tests_with_coverage():
    """Run tests with coverage reporting"""
    command = "pytest tests/ --cov=backend --cov-report=html --cov-report=term-missing -v"
    return run_command(command, "Running tests with coverage")

def run_specific_test_file(test_file):
    """Run a specific test file"""
    command = f"pytest tests/{test_file} -v"
    return run_command(command, f"Running tests from {test_file}")

def run_tests_by_marker(marker):
    """Run tests with specific marker"""
    command = f"pytest tests/ -m {marker} -v"
    return run_command(command, f"Running tests with marker: {marker}")

def run_parallel_tests():
    """Run tests in parallel"""
    command = "pytest tests/ -n auto -v"
    return run_command(command, "Running tests in parallel")

def run_performance_tests():
    """Run performance tests"""
    command = "pytest tests/ -m slow --durations=10 -v"
    return run_command(command, "Running performance tests")

def lint_code():
    """Run code linting"""
    commands = [
        ("flake8 backend/ --max-line-length=88 --ignore=E203,W503", "Running flake8 linting"),
        ("black backend/ --check", "Checking code formatting with black"),
        ("isort backend/ --check-only", "Checking import sorting with isort")
    ]
    
    all_passed = True
    for command, description in commands:
        try:
            success = run_command(command, description)
            if not success:
                all_passed = False
        except FileNotFoundError:
            print(f"⚠️  Skipping {description} - tool not installed")
    
    return all_passed

def generate_test_report():
    """Generate comprehensive test report"""
    commands = [
        "pytest tests/ --junitxml=test_results.xml --cov=backend --cov-report=xml",
        "pytest tests/ --html=test_report.html --self-contained-html"
    ]
    
    for command in commands:
        run_command(command, "Generating test reports")

def clean_test_artifacts():
    """Clean up test artifacts"""
    artifacts = [
        "test.db",
        ".coverage",
        "htmlcov/",
        "__pycache__/",
        ".pytest_cache/",
        "test_results.xml",
        "test_report.html",
        "coverage.xml"
    ]
    
    print("🧹 Cleaning up test artifacts...")
    for artifact in artifacts:
        if Path(artifact).exists():
            if Path(artifact).is_dir():
                run_command(f"rm -rf {artifact}")
            else:
                run_command(f"rm {artifact}")
            print(f"   Removed {artifact}")

def main():
    """Main test runner function"""
    parser = argparse.ArgumentParser(description="Fast React Movies Backend Test Runner")
    
    parser.add_argument("--setup", action="store_true", 
                       help="Set up test environment")
    parser.add_argument("--unit", action="store_true",
                       help="Run unit tests only")
    parser.add_argument("--integration", action="store_true", 
                       help="Run integration tests only")
    parser.add_argument("--all", action="store_true",
                       help="Run all tests")
    parser.add_argument("--coverage", action="store_true",
                       help="Run tests with coverage")
    parser.add_argument("--file", type=str,
                       help="Run specific test file")
    parser.add_argument("--marker", type=str,
                       help="Run tests with specific marker")
    parser.add_argument("--parallel", action="store_true",
                       help="Run tests in parallel")
    parser.add_argument("--performance", action="store_true",
                       help="Run performance tests")
    parser.add_argument("--lint", action="store_true",
                       help="Run code linting")
    parser.add_argument("--report", action="store_true",
                       help="Generate comprehensive test report")
    parser.add_argument("--clean", action="store_true",
                       help="Clean up test artifacts")
    
    args = parser.parse_args()
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    success = True
    
    if args.setup:
        setup_test_environment()
    
    if args.clean:
        clean_test_artifacts()
    
    if args.lint:
        success = lint_code() and success
    
    if args.unit:
        success = run_unit_tests() and success
    
    if args.integration:
        success = run_integration_tests() and success
    
    if args.coverage:
        success = run_tests_with_coverage() and success
    
    if args.file:
        success = run_specific_test_file(args.file) and success
    
    if args.marker:
        success = run_tests_by_marker(args.marker) and success
    
    if args.parallel:
        success = run_parallel_tests() and success
    
    if args.performance:
        success = run_performance_tests() and success
    
    if args.report:
        generate_test_report()
    
    if args.all:
        success = run_all_tests() and success
    
    # If no specific arguments provided, run basic test suite
    if not any(vars(args).values()):
        print("🎯 Running default test suite...")
        success = run_all_tests()
    
    # Print summary
    if success:
        print("\n✅ All tests completed successfully!")
    else:
        print("\n❌ Some tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()