# CMake generated Testfile for 
# Source directory: /Users/asmailada/MakeupBot/stasm4.1.0
# Build directory: /Users/asmailada/MakeupBot/stasm4.1.0/build
# 
# This file includes the relevant testing commands required for 
# testing this directory and lists subdirectories to be tested as well.
add_test(TestMinimal "./minimal")
add_test(TestMinimal2 "./minimal2")
add_test(TestStasm "./stasmMain" "../data/testface.jpg")
add_test(TestStasmMulti "./stasmMain" "-m" "../tests/data/testmulti.jpg")
add_test(TestStasmMulti2 "./stasmMain" "-d" "-m" "-s" "-c" "../tests/data/testmulti.jpg")
add_test(TestStasm68 "./stasmMain" "-i" "-n" "68" "../data/testface.jpg")
